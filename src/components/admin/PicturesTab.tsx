import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Tv, 
  Volume2, 
  Hammer, 
  Filter,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { SitePicture, PictureCategory, ServiceCategory } from '../../types';
import { 
  getAllPictures, 
  addPicture, 
  updatePicture, 
  deletePicture, 
  resetPictures,
  getSiteSettings,
  saveSiteSettings,
  addServiceGalleryImage
} from '../../data/adminStore';
import { ImageInputWithPicker } from './ImageInputWithPicker';

interface PicturesTabProps {
  onRefresh: () => void;
}

export const PicturesTab: React.FC<PicturesTabProps> = ({ onRefresh }) => {
  const [pictures, setPictures] = useState<SitePicture[]>(getAllPictures());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPicture, setEditingPicture] = useState<SitePicture | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState<{
    title: string;
    url: string;
    category: PictureCategory;
    caption: string;
    tags: string;
  }>({
    title: '',
    url: '',
    category: 'lighting',
    caption: '',
    tags: '',
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const refreshList = () => {
    setPictures(getAllPictures());
    onRefresh();
  };

  const handleOpenAddModal = () => {
    setEditingPicture(null);
    setFormData({
      title: '',
      url: '',
      category: 'lighting',
      caption: '',
      tags: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (pic: SitePicture) => {
    setEditingPicture(pic);
    setFormData({
      title: pic.title,
      url: pic.url,
      category: pic.category,
      caption: pic.caption || '',
      tags: pic.tags?.join(', ') || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSavePicture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingPicture) {
      updatePicture({
        ...editingPicture,
        title: formData.title,
        url: formData.url,
        category: formData.category,
        caption: formData.caption,
        tags: tagsArray,
      });
      showToast('Picture updated successfully!');
    } else {
      addPicture({
        title: formData.title || 'Event Production Photo',
        url: formData.url,
        category: formData.category,
        caption: formData.caption,
        tags: tagsArray,
      });
      showToast('New picture added to site media library!');
    }

    setIsAddModalOpen(false);
    refreshList();
  };

  const handleDeletePicture = (id: string, title: string) => {
    if (confirm(`Delete "${title}" from the media library?`)) {
      deletePicture(id);
      showToast('Picture removed from media library');
      refreshList();
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Image URL copied to clipboard!');
  };

  const handleSetAsHero = (url: string) => {
    const settings = getSiteSettings();
    saveSiteSettings({
      ...settings,
      heroImageUrl: url,
    });
    showToast('Homepage hero background photo updated!');
    onRefresh();
  };

  const handleAssignToService = (category: PictureCategory, url: string) => {
    if (['lighting', 'trussing', 'led-screens', 'audio-sound', 'stage-boardwork'].includes(category)) {
      addServiceGalleryImage(category as ServiceCategory, url);
      showToast(`Added picture to ${category} gallery!`);
      onRefresh();
    } else {
      alert('Please select a service category (Lighting, Trussing, LED Screens, Sound, or Stage) for this picture first.');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Restore default factory pictures library?')) {
      resetPictures();
      showToast('Pictures restored to defaults');
      refreshList();
    }
  };

  // Filtered pictures
  const filteredPictures = pictures.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const categoriesList = [
    { id: 'All', label: 'All Pictures' },
    { id: 'hero', label: 'Hero Banners' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'trussing', label: 'Trussing' },
    { id: 'led-screens', label: 'LED Screens' },
    { id: 'audio-sound', label: 'Audio & Sound' },
    { id: 'stage-boardwork', label: 'Stage Decks' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Site Media & Pictures Database
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Add, edit, replace, and delete all pictures across the homepage, services, hero banners, and galleries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl bg-[#1A1C20] hover:bg-[#252830] text-neutral-400 hover:text-white border border-[#2E323B] text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#2563EB]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Picture</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {feedbackToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar scrollbar-none">
            {categoriesList.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pictures or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Counter */}
        <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between border-t border-[#2E323B] pt-2">
          <span>Showing {filteredPictures.length} of {pictures.length} pictures in media library</span>
          <span className="text-[#2563EB]">Live updates sync across whole site</span>
        </div>
      </div>

      {/* Pictures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPictures.map(pic => {
          const isCopied = copiedId === pic.id;
          return (
            <div
              key={pic.id}
              className="rounded-2xl bg-[#1A1C20] border border-[#2E323B] overflow-hidden group hover:border-[#2563EB]/60 transition-all flex flex-col justify-between shadow-lg"
            >
              {/* Picture Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={pic.url}
                  alt={pic.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono uppercase font-bold text-white border border-white/10 backdrop-blur-sm">
                    {pic.category}
                  </span>
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-90">
                  <button
                    onClick={() => handleCopyUrl(pic.id, pic.url)}
                    title="Copy URL"
                    className="p-1.5 rounded-lg bg-black/75 text-white hover:bg-[#2563EB] transition backdrop-blur-sm"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={pic.url}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Image"
                    className="p-1.5 rounded-lg bg-black/75 text-white hover:bg-neutral-800 transition backdrop-blur-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Info & Details */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white truncate" title={pic.title}>
                    {pic.title}
                  </h3>
                  {pic.caption && (
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {pic.caption}
                    </p>
                  )}
                  {pic.tags && pic.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pic.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#121316] text-neutral-400 border border-[#2E323B]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Placement Actions */}
                <div className="pt-3 border-t border-[#2E323B] space-y-2">
                  <div className="flex items-center gap-1.5">
                    {pic.category === 'hero' ? (
                      <button
                        type="button"
                        onClick={() => handleSetAsHero(pic.url)}
                        className="flex-1 py-1.5 rounded-lg bg-[#2563EB]/20 text-[#60A5FA] hover:bg-[#2563EB] hover:text-white border border-[#2563EB]/40 text-[10px] font-bold transition"
                      >
                        Set as Homepage Hero
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAssignToService(pic.category, pic.url)}
                        className="flex-1 py-1.5 rounded-lg bg-[#121316] text-neutral-300 hover:text-white hover:bg-[#252830] border border-[#2E323B] text-[10px] font-bold transition"
                      >
                        Push to {pic.category} Gallery
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleOpenEditModal(pic)}
                      className="text-neutral-400 hover:text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Info</span>
                    </button>

                    <button
                      onClick={() => handleDeletePicture(pic.id, pic.title)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Picture Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#1A1C20] border border-[#2E323B] p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
                  MEDIA ASSET
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">
                  {editingPicture ? 'Edit Picture Details' : 'Add New Picture to Site'}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white text-lg font-mono font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePicture} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                  Picture Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 380W Moving Heads Live Concert"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              {/* Image Input with Device Upload, Library & Presets */}
              <ImageInputWithPicker
                label="Image Asset (File Upload or URL)"
                value={formData.url}
                onChange={url => setFormData({ ...formData, url })}
                categoryContext={formData.category}
                aspectRatio="video"
                helperText="Upload any image directly from your phone/computer, select from presets, or paste a link."
                required
              />

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as PictureCategory })}
                  className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="hero">Homepage Hero Banner</option>
                  <option value="lighting">Lighting Systems</option>
                  <option value="trussing">Structural Trussing & Rigging</option>
                  <option value="led-screens">High-Definition LED Screens</option>
                  <option value="audio-sound">Pro Audio & Concert Sound</option>
                  <option value="stage-boardwork">Stage Decks & CNC Boardwork</option>
                  <option value="portfolio">Portfolio Projects</option>
                  <option value="gallery">General Gallery</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                  Caption / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Avolites DMX light show at Speke Resort Munyonyo"
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Concert, Beams, Kampala, Moving Heads"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E323B]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#252830] text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition shadow-lg shadow-[#2563EB]/25"
                >
                  {editingPicture ? 'Save Changes' : 'Add Picture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
