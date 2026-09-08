import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Tv, 
  Volume2, 
  Hammer, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink,
  Image as ImageIcon,
  Edit3,
  HelpCircle
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../../types';
import { updateService, resetServices, getServices, addServiceGalleryImage, removeServiceGalleryImage } from '../../data/adminStore';
import { ImageInputWithPicker } from './ImageInputWithPicker';

interface ServicesTabProps {
  services: ServiceItem[];
  onRefresh: () => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ services, onRefresh }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceCategory>('lighting');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newSpecText, setNewSpecText] = useState('');
  const [newCapText, setNewCapText] = useState('');

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const [formData, setFormData] = useState<ServiceItem>(currentService);

  // When selected service changes, sync local form
  const handleSelectService = (id: ServiceCategory) => {
    setSelectedServiceId(id);
    const target = services.find(s => s.id === id) || services[0];
    setFormData(target);
    setNewGalleryUrl('');
    setNewSpecText('');
    setNewCapText('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateService(formData);
    onRefresh();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleResetCurrent = () => {
    if (confirm(`Reset ${formData.title} to factory defaults?`)) {
      resetServices();
      onRefresh();
      const reloaded = getServices().find(s => s.id === selectedServiceId);
      if (reloaded) setFormData(reloaded);
    }
  };

  const handleAddGalleryImage = () => {
    const url = newGalleryUrl.trim();
    if (!url) return;
    const current = formData.galleryImages || [];
    if (!current.includes(url)) {
      setFormData({
        ...formData,
        galleryImages: [url, ...current],
      });
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    const current = formData.galleryImages || [];
    setFormData({
      ...formData,
      galleryImages: current.filter(u => u !== urlToRemove),
    });
  };

  const handleAddSpec = () => {
    if (!newSpecText.trim()) return;
    setFormData({
      ...formData,
      specs: [...(formData.specs || []), newSpecText.trim()],
    });
    setNewSpecText('');
  };

  const handleRemoveSpec = (index: number) => {
    const next = [...formData.specs];
    next.splice(index, 1);
    setFormData({ ...formData, specs: next });
  };

  const handleAddCap = () => {
    if (!newCapText.trim()) return;
    setFormData({
      ...formData,
      capabilities: [...(formData.capabilities || []), newCapText.trim()],
    });
    setNewCapText('');
  };

  const handleRemoveCap = (index: number) => {
    const next = [...formData.capabilities];
    next.splice(index, 1);
    setFormData({ ...formData, capabilities: next });
  };

  const getServiceIcon = (id: ServiceCategory) => {
    switch (id) {
      case 'lighting': return <Sparkles className="w-4 h-4 text-[#FF2E00]" />;
      case 'trussing': return <Layers className="w-4 h-4 text-[#00F0FF]" />;
      case 'led-screens': return <Tv className="w-4 h-4 text-[#FFE600]" />;
      case 'audio-sound': return <Volume2 className="w-4 h-4 text-[#00FF66]" />;
      case 'stage-boardwork': return <Hammer className="w-4 h-4 text-[#FF0055]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Services & Production Pillars
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Edit technical descriptions, specifications, hero banners, and gallery photos for all 5 core Royal Concepts services.
          </p>
        </div>

        {isSavedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Service Updated & Synced to Live Site!</span>
          </div>
        )}
      </div>

      {/* Service Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
        {services.map(s => {
          const isSelected = s.id === selectedServiceId;
          return (
            <button
              key={s.id}
              onClick={() => handleSelectService(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 border border-[#2563EB]'
                  : 'bg-[#1A1C20] text-neutral-400 hover:text-white border border-[#2E323B]'
              }`}
            >
              {getServiceIcon(s.id)}
              <span>{s.title}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-[#121316] text-neutral-500'}`}>
                {s.galleryImages?.length || 0} pics
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Service Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Core Titles & Taglines */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
                PILLAR DETAILS
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Service Headlines & Copy
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#121316] text-neutral-300 font-mono text-[10px] font-bold border border-[#2E323B]">
              ID: {formData.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Subtitle *
              </label>
              <input
                type="text"
                required
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Short Tagline (Shown on cards & preview)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Homepage Overview Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl p-3 text-white outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Detailed Technical Description (Service Page)
              </label>
              <textarea
                rows={4}
                value={formData.longDescription}
                onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl p-3 text-white outline-none leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Hero Image & Media Gallery */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
              VISUAL ASSETS
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Hero Cover & Gallery Photos ({formData.galleryImages?.length || 0})
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage the primary hero cover photo and all interactive gallery photos displayed on the dedicated service showcase page.
            </p>
          </div>

          {/* Primary Hero Cover with ImageInputWithPicker */}
          <div className="pt-1">
            <ImageInputWithPicker
              label="Primary Hero Cover Picture"
              value={formData.imageUrl}
              onChange={url => setFormData({ ...formData, imageUrl: url })}
              categoryContext={formData.id}
              aspectRatio="video"
              helperText="This picture acts as the main background banner on the dedicated service page and featured cards across the site. Upload from your device, choose from the media library, or paste a URL."
              required
            />
          </div>

          {/* Gallery Management */}
          <div className="space-y-3 pt-4 border-t border-[#2E323B] text-xs">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-mono text-[10px] text-neutral-300 uppercase font-semibold block">
                  Service Gallery Showcase Photos
                </label>
                <span className="text-neutral-400 font-mono text-[10px]">
                  {formData.galleryImages?.length || 0} active pictures • Displayed in the interactive modal lightbox
                </span>
              </div>
            </div>

            {/* Add Photo with ImageInputWithPicker */}
            <div className="p-3.5 rounded-xl bg-[#121316] border border-[#2E323B] space-y-2">
              <ImageInputWithPicker
                label="Add New Gallery Picture"
                value={newGalleryUrl}
                onChange={url => {
                  setNewGalleryUrl(url);
                  if (url && !(formData.galleryImages || []).includes(url)) {
                    setFormData({
                      ...formData,
                      galleryImages: [url, ...(formData.galleryImages || [])],
                    });
                    setNewGalleryUrl('');
                  }
                }}
                categoryContext={formData.id}
                placeholder="Paste URL or click Upload Device File / Pictures Library above..."
                helperText="Upload any picture from your device or select from the pictures library to instantly add it to this service's gallery."
              />
            </div>

            {/* Gallery Grid with Replace, Hero, and Delete controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {(formData.galleryImages || []).map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className="group relative aspect-video rounded-xl overflow-hidden border border-[#2E323B] bg-black shadow-md"
                >
                  <img
                    src={imgUrl}
                    alt={`${formData.title} ${idx + 1}`}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: imgUrl })}
                      title="Set as Hero Cover Picture"
                      className="w-full py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-mono font-bold transition"
                    >
                      Make Hero
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newUrl = prompt('Enter new image URL or paste link to replace this photo:', imgUrl);
                        if (newUrl && newUrl.trim()) {
                          const updated = [...(formData.galleryImages || [])];
                          updated[idx] = newUrl.trim();
                          setFormData({ ...formData, galleryImages: updated });
                        }
                      }}
                      title="Replace this picture"
                      className="w-full py-1 rounded bg-[#1A1C20] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] text-[10px] font-mono transition"
                    >
                      Change Picture
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(imgUrl)}
                      title="Remove Picture"
                      className="w-full py-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-mono transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-mono bg-black/70 text-neutral-300 px-1.5 py-0.5 rounded pointer-events-none">
                    #{idx + 1}
                  </span>
                  {formData.imageUrl === imgUrl && (
                    <span className="absolute top-1 right-1 text-[8px] font-mono bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full font-bold pointer-events-none shadow">
                      HERO
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Specifications & Capabilities */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
              ENGINEERING & HARDWARE
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Key Specifications & Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Specs Column */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold block">
                Hardware Specifications
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecText}
                  onChange={e => setNewSpecText(e.target.value)}
                  placeholder="e.g. 380W Moving Heads..."
                  className="flex-1 bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar scrollbar-none">
                {(formData.specs || []).map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#121316] border border-[#2E323B]">
                    <span className="text-neutral-200 truncate mr-2">{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(i)}
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities Column */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold block">
                Stage Capabilities & Deployments
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCapText}
                  onChange={e => setNewCapText(e.target.value)}
                  placeholder="e.g. Timecode-synced concert cues..."
                  className="flex-1 bg-[#121316] border border-[#2E323B] rounded-xl px-3 py-2 text-white outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCap}
                  className="px-3 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar scrollbar-none">
                {(formData.capabilities || []).map((cap, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#121316] border border-[#2E323B]">
                    <span className="text-neutral-200 truncate mr-2">{cap}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCap(i)}
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetCurrent}
            className="px-4 py-2.5 rounded-xl bg-[#121316] hover:bg-[#252830] text-neutral-400 hover:text-white border border-[#2E323B] text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset {formData.title}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-[#2563EB]/25 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish {formData.title}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
