import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Wrench, 
  Tv, 
  Volume2, 
  Layers, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  MapPin,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { EquipmentItemAdmin, ServiceCategory } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

interface EquipmentTabProps {
  equipment: EquipmentItemAdmin[];
  onUpdateItem: (item: EquipmentItemAdmin) => void;
  onAddItem: (item: Omit<EquipmentItemAdmin, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

export const EquipmentTab: React.FC<EquipmentTabProps> = ({
  equipment,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'All' | 'Operational' | 'On Live Stage' | 'In Maintenance' | 'Reserved'>('All');
  
  // Quick Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(0);
  const [editUnits, setEditUnits] = useState<number>(0);
  const [editCondition, setEditCondition] = useState<any>('Operational');

  // New Item State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<ServiceCategory>('led-screens');
  const [newUnits, setNewUnits] = useState(12);
  const [newRate, setNewRate] = useState(350000);
  const [newLocation, setNewLocation] = useState('Kampala Central Warehouse');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Equipment Photo Modal State
  const [photoModalItem, setPhotoModalItem] = useState<EquipmentItemAdmin | null>(null);
  const [photoModalUrl, setPhotoModalUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getFallbackEquipmentImg = (cat: ServiceCategory) => {
    switch (cat) {
      case 'lighting': return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80';
      case 'trussing': return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80';
      case 'led-screens': return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80';
      case 'audio-sound': return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80';
      case 'stage-boardwork': return 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80';
      default: return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80';
    }
  };

  const categories = [
    { id: 'All', label: 'All Equipment' },
    { id: 'lighting', label: 'Lights' },
    { id: 'trussing', label: 'Trusses' },
    { id: 'led-screens', label: 'LED Screens' },
    { id: 'audio-sound', label: 'Sound' },
    { id: 'stage-boardwork', label: 'Boardwork' },
  ];

  const filtered = equipment.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCond = conditionFilter === 'All' || item.condition === conditionFilter;

    return matchesCat && matchesSearch && matchesCond;
  });

  const handleStartEdit = (item: EquipmentItemAdmin) => {
    setEditingId(item.id);
    setEditRate(item.dailyRateUGX);
    setEditUnits(item.availableUnits);
    setEditCondition(item.condition);
  };

  const handleSaveEdit = (item: EquipmentItemAdmin) => {
    onUpdateItem({
      ...item,
      dailyRateUGX: editRate,
      availableUnits: editUnits,
      condition: editCondition,
    });
    setEditingId(null);
    setToastMessage(`Saved & Published "${item.name}" live to system!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddItem({
      name: newName.trim(),
      category: newCat,
      model: 'Commercial Event Rigging Edition',
      powerRequirement: '220V - 380V Industrial',
      dimensions: 'Standard Truss / Modular',
      weight: 'Custom Rig Spec',
      availableUnits: newUnits,
      condition: 'Operational',
      dailyRateUGX: newRate,
      location: newLocation,
      imageUrl: newImageUrl.trim() || undefined,
      specs: ['Certified High-Safety Rigging', 'Tour-grade hardware', 'Clean DMX / Audio Patching'],
      features: ['Certified High-Safety Rigging', 'Clean DMX / Audio Patching'],
    });

    const addedName = newName.trim();
    setNewName('');
    setNewImageUrl('');
    setIsAddOpen(false);
    setToastMessage(`Added & Published "${addedName}" live to system!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Operational':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'On Live Stage':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Reserved':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'In Maintenance':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Services & Equipment Inventory
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage stage fleet inventory for Lights, Trusses, LED Screens, Sound & Boardwork across Kampala and Namanve depots.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#2563EB]/25"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Fleet Equipment</span>
        </button>
      </div>

      {/* Live Publish Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Add New Equipment Drawer / Box */}
      {isAddOpen && (
        <form 
          onSubmit={handleCreateNew}
          className="p-5 rounded-2xl bg-[#1A1C20] border border-[#2563EB] shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
            <h3 className="text-sm font-bold text-white">Add New Equipment to Fleet</h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-mono text-[10px] text-neutral-400 uppercase">Item Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Chauvet Maverick MK2 Spot"
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase">Category *</label>
              <select
                value={newCat}
                onChange={e => setNewCat(e.target.value as ServiceCategory)}
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#2563EB]"
              >
                <option value="lighting">Lights</option>
                <option value="trussing">Trusses</option>
                <option value="led-screens">LED Screens</option>
                <option value="audio-sound">Sound</option>
                <option value="stage-boardwork">Boardwork</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase">Available Units</label>
              <input
                type="number"
                min="1"
                value={newUnits}
                onChange={e => setNewUnits(parseInt(e.target.value) || 1)}
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase">Daily Rate (UGX)</label>
              <input
                type="number"
                step="10000"
                value={newRate}
                onChange={e => setNewRate(parseInt(e.target.value) || 0)}
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>
          </div>

          {/* Equipment Photo Input */}
          <div className="pt-1">
            <ImageInputWithPicker
              label="Equipment Photo (Upload or Library)"
              value={newImageUrl}
              onChange={setNewImageUrl}
              categoryContext={newCat}
              aspectRatio="video"
              helperText="Add a high-resolution photo of this equipment unit from your device or site library."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B] text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md shadow-[#2563EB]/25 transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Publish to System</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar: Category Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25'
                  : 'bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Condition and Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search gear..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#121316] border border-[#2E323B] text-xs text-white placeholder-neutral-500 outline-none w-44"
            />
          </div>

          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value as any)}
            className="bg-[#121316] border border-[#2E323B] rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="On Live Stage">On Live Stage</option>
            <option value="Reserved">Reserved</option>
            <option value="In Maintenance">In Maintenance</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-[#1A1C20] border border-[#2E323B] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121316] text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-[#2E323B]">
              <tr>
                <th className="py-3 px-3 w-14">Photo</th>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Daily Rate (UGX)</th>
                <th className="py-3 px-4">Fleet Status</th>
                <th className="py-3 px-4">Depot Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E323B]">
              {filtered.map(item => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className="hover:bg-[#202328] transition-colors">
                    {/* Equipment Photo */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div 
                        onClick={() => {
                          setPhotoModalItem(item);
                          setPhotoModalUrl(item.imageUrl || '');
                        }}
                        className="group/img relative w-12 h-10 rounded-lg overflow-hidden border border-[#2E323B] bg-black cursor-pointer hover:border-[#2563EB] transition shadow"
                        title="Click to view or change equipment picture"
                      >
                        <img
                          src={item.imageUrl || getFallbackEquipmentImg(item.category)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Edit2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </td>

                    {/* Item Name */}
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{item.model}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#121316] border border-[#2E323B] text-neutral-300">
                        {item.category.toUpperCase()}
                      </span>
                    </td>

                    {/* Available Units */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editUnits}
                          onChange={e => setEditUnits(parseInt(e.target.value) || 0)}
                          className="w-16 bg-[#121316] border border-[#2563EB] rounded px-1.5 py-0.5 text-white"
                        />
                      ) : (
                        <span className={item.availableUnits > 0 ? 'text-white' : 'text-rose-400'}>
                          {item.availableUnits} Units
                        </span>
                      )}
                    </td>

                    {/* Daily Rate */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-emerald-400 font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          step="10000"
                          value={editRate}
                          onChange={e => setEditRate(parseInt(e.target.value) || 0)}
                          className="w-28 bg-[#121316] border border-[#2563EB] rounded px-1.5 py-0.5 text-white"
                        />
                      ) : (
                        <span>UGX {item.dailyRateUGX.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editCondition}
                          onChange={e => setEditCondition(e.target.value as any)}
                          className="bg-[#121316] border border-[#2563EB] rounded px-1.5 py-0.5 text-xs text-white"
                        >
                          <option value="Operational">Operational</option>
                          <option value="On Live Stage">On Live Stage</option>
                          <option value="Reserved">Reserved</option>
                          <option value="In Maintenance">In Maintenance</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(item)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-[#121316] hover:bg-[#252830] text-neutral-400 hover:text-white border border-[#2E323B] transition"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="px-2.5 py-1 rounded-lg bg-[#121316] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] transition flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setPhotoModalItem(item);
                              setPhotoModalUrl(item.imageUrl || '');
                            }}
                            className="px-2 py-1 rounded-lg bg-[#121316] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] transition flex items-center gap-1 font-mono text-[11px]"
                            title="Change equipment picture"
                          >
                            <Sparkles className="w-3 h-3 text-[#2563EB]" />
                            <span>Picture</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${item.name} from inventory?`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#121316] hover:bg-red-950/40 text-neutral-500 hover:text-red-400 border border-[#2E323B] transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Photo Edit Modal */}
      {photoModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1C20] border border-[#2E323B] rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#2563EB] uppercase font-bold">Equipment Fleet Picture</span>
                <h3 className="text-base font-bold text-white mt-0.5">{photoModalItem.name}</h3>
              </div>
              <button
                onClick={() => setPhotoModalItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ImageInputWithPicker
              label="Gear Showcase Picture"
              value={photoModalUrl}
              onChange={setPhotoModalUrl}
              categoryContext={photoModalItem.category}
              aspectRatio="video"
              helperText="Upload any real gear photo from your phone/computer, select from the pictures library, or paste a link."
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E323B]">
              <button
                type="button"
                onClick={() => setPhotoModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#121316] text-neutral-300 hover:text-white border border-[#2E323B] text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateItem({
                    ...photoModalItem,
                    imageUrl: photoModalUrl.trim() || undefined,
                  });
                  setPhotoModalItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-md shadow-[#2563EB]/25"
              >
                Save Equipment Picture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
