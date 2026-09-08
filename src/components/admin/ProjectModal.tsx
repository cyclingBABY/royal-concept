import React, { useState } from 'react';
import { X, Upload, Check, Trash2 } from 'lucide-react';
import { PortfolioProjectAdmin, PortfolioCategory } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit?: PortfolioProjectAdmin | null;
  onClose: () => void;
  onSave: (data: Omit<PortfolioProjectAdmin, 'id'>, isPublish: boolean) => void;
  onDelete?: (id: string) => void;
}

const AVAILABLE_EQUIPMENT = [
  'Modular P3.9 Outdoor LED Screen',
  'Ultra-Fine P2.9 Indoor LED Wall',
  '48x Beam 380W Moving Heads',
  '16x12m Aluminum Box Roof Truss',
  'JBL VTX Concert Line Array PA',
  'Midas M32 40-Channel Digital Console',
  'CNC Custom Wood Stage Boardwork',
  'Cryo CO2 Jet & Cold Spark Blast',
  'Wireless Battery Uplighters (RGBWA)',
  'Multi-tier Choir & VIP Risers',
  'Shure Axient Digital Wireless Mics',
  'NovaStar 4K Ultra-Low-Latency Processor',
];

const PRESET_IMAGES = [
  { label: 'Concert Mainstage', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Corporate Summit', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Massive Arena Rally', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Exhibition Pavilion', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gala & Ballroom', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Lighting Rig Dynamics', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80' },
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [category, setCategory] = useState<'Concerts' | 'Corporate Events' | 'Stage Builds' | 'Exhibitions'>(
    projectToEdit?.category || 'Concerts'
  );
  const [client, setClient] = useState(projectToEdit?.client || '');
  const [venue, setVenue] = useState(projectToEdit?.venue || '');
  const [date, setDate] = useState(projectToEdit?.date || '');
  const [attendance, setAttendance] = useState(projectToEdit?.attendance || '1,000+ Attendees');
  const [imageUrl, setImageUrl] = useState(projectToEdit?.imageUrl || PRESET_IMAGES[0].url);
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [highlight, setHighlight] = useState(projectToEdit?.highlight || '');
  const [equipmentUsed, setEquipmentUsed] = useState<string[]>(
    projectToEdit?.equipmentUsed || ['Modular P3.9 Outdoor LED Screen', '48x Beam 380W Moving Heads']
  );
  const [customEquip, setCustomEquip] = useState('');
  const [isOnSite, setIsOnSite] = useState(projectToEdit?.isOnSite ?? false);

  if (!isOpen) return null;

  const toggleEquipment = (item: string) => {
    setEquipmentUsed(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const handleAddCustomEquipment = () => {
    if (customEquip.trim() && !equipmentUsed.includes(customEquip.trim())) {
      setEquipmentUsed([...equipmentUsed, customEquip.trim()]);
      setCustomEquip('');
    }
  };

  const handleSubmit = (isPublish: boolean) => {
    if (!title.trim() || !venue.trim()) {
      alert('Please provide a project title and venue.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        client: client.trim() || 'Confidential Client',
        venue: venue.trim(),
        date: date.trim() || 'Recent Production',
        attendance: attendance.trim() || '1,000+ Attendees',
        imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
        description: description.trim() || 'Full-scale event production and stage engineering.',
        equipmentUsed: equipmentUsed.length > 0 ? equipmentUsed : ['LED Screens', 'Moving Heads', 'Roof Truss'],
        highlight: highlight.trim() || 'Flawless zero-latency production execution.',
        status: isPublish ? 'Published' : 'Draft',
        isOnSite,
      },
      isPublish
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto no-scrollbar scrollbar-none">
      <div 
        id="project-portfolio-modal"
        className="relative w-full max-w-2xl bg-[#1A1C20] border border-[#2E323B] rounded-2xl shadow-2xl p-6 sm:p-7 text-neutral-100 my-8 space-y-5"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2E323B] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#2563EB] uppercase tracking-wider">
              PORTFOLIO CMS
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {projectToEdit ? 'Edit Portfolio Showcase' : 'Add New Event Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs no-scrollbar scrollbar-none">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. East Africa Rhythm Festival"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Category Dropdown *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none"
              >
                <option value="Concerts">Concerts</option>
                <option value="Corporate Events">Corporate Events</option>
                <option value="Stage Builds">Stage Builds</option>
                <option value="Exhibitions">Exhibitions</option>
              </select>
            </div>
          </div>

          {/* Client, Venue, Event Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Client / Organizer
              </label>
              <input
                type="text"
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="e.g. Stanbic Bank / Live Nation"
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Lugogo Oval, Kampala"
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Event Date
              </label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>
          </div>

          {/* Attendance & On-Site Active Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Estimated Attendance
              </label>
              <input
                type="text"
                value={attendance}
                onChange={e => setAttendance(e.target.value)}
                placeholder="e.g. 10,000+ Attendees"
                className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="modal-onsite-toggle"
                checked={isOnSite}
                onChange={e => setIsOnSite(e.target.checked)}
                className="w-4 h-4 rounded accent-[#2563EB] cursor-pointer"
              />
              <label htmlFor="modal-onsite-toggle" className="cursor-pointer text-neutral-300 font-medium">
                Mark as <span className="text-emerald-400 font-bold">Currently On-Site / Active Project</span>
              </label>
            </div>
          </div>

          {/* Image URL, File Upload & Library Selection */}
          <div className="pt-1">
            <ImageInputWithPicker
              label="Project Showcase Cover Picture"
              value={imageUrl}
              onChange={setImageUrl}
              categoryContext="portfolio"
              presets={PRESET_IMAGES}
              aspectRatio="video"
              helperText="Upload event photos directly from your device, choose from the site's media library, or paste an external image URL."
              required
            />
          </div>

          {/* Equipment Used Checkboxes */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center justify-between">
              <span>Equipment Used (Check all that apply)</span>
              <span className="text-[#2563EB] font-bold">{equipmentUsed.length} Selected</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3 rounded-xl bg-[#121316] border border-[#2E323B] max-h-36 overflow-y-auto no-scrollbar scrollbar-none">
              {AVAILABLE_EQUIPMENT.map(equip => {
                const checked = equipmentUsed.includes(equip);
                return (
                  <label
                    key={equip}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1A1C20] cursor-pointer text-[11px] text-neutral-300 transition"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEquipment(equip)}
                      className="rounded accent-[#2563EB] w-3.5 h-3.5"
                    />
                    <span className={checked ? 'text-white font-medium' : ''}>{equip}</span>
                  </label>
                );
              })}
            </div>

            {/* Add Custom Equipment Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customEquip}
                onChange={e => setCustomEquip(e.target.value)}
                placeholder="Or add custom gear name..."
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomEquipment();
                  }
                }}
                className="flex-1 bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomEquipment}
                className="px-3 py-1.5 rounded-xl bg-[#2E323B] hover:bg-[#3B404D] text-white text-xs font-bold transition"
              >
                + Add Gear
              </button>
            </div>
          </div>

          {/* Description & Highlight */}
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
              Project Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the production scale, staging challenge, or audience experience..."
              className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl p-2.5 text-white outline-none text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
              Key Technical Highlight
            </label>
            <input
              type="text"
              value={highlight}
              onChange={e => setHighlight(e.target.value)}
              placeholder="e.g. Zero-latency video broadcast with 12 hours continuous live uptime."
              className="w-full bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none text-xs"
            />
          </div>
        </div>

        {/* Action Buttons: Publish Project, Save Draft, Delete */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2E323B]">
          <div>
            {projectToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete project "${projectToEdit.title}"?`)) {
                    onDelete(projectToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#252830] text-neutral-300 border border-[#2E323B] text-xs font-bold transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 rounded-xl bg-[#262930] hover:bg-[#323640] text-neutral-200 border border-[#3A3F4B] text-xs font-bold transition"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-[#2563EB]/25 transition flex items-center gap-1.5"
              title="Publish live to Royal Concepts public portfolio and service pages"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Publish to System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
