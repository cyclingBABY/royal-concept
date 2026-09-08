import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  X, 
  Check, 
  Search, 
  Sparkles, 
  ExternalLink,
  Layers,
  ZoomIn,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { PictureCategory, SitePicture } from '../../types';
import { getAllPictures, addPicture } from '../../data/adminStore';

interface ImageInputWithPickerProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  categoryContext?: PictureCategory | string;
  presets?: { label: string; url: string }[];
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'banner' | 'auto';
  placeholder?: string;
  required?: boolean;
}

const DEFAULT_PRESETS = [
  { label: 'Moving Heads & Lasers', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Festival Mainstage', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Corporate LED Wall', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Concert Crowd & Lights', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Aluminum Truss Rig', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pro Sound Line Array', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80' },
];

export const ImageInputWithPicker: React.FC<ImageInputWithPickerProps> = ({
  label = 'Picture / Image Asset',
  value,
  onChange,
  categoryContext = 'lighting',
  presets,
  helperText,
  aspectRatio = 'video',
  placeholder = 'Paste image URL or upload from your device...',
  required = false,
}) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState<string>('All');
  const [librarySearch, setLibrarySearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePresets = presets || DEFAULT_PRESETS;
  const allLibraryPictures = getAllPictures();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    // Limit client upload size check (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size exceeds 10MB. Please use a compressed image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);

        // Auto-register in the site media library so it can be reused anywhere
        try {
          const validCat: PictureCategory = [
            'lighting', 'trussing', 'led-screens', 'audio-sound', 'stage-boardwork', 'hero', 'portfolio', 'gallery', 'general'
          ].includes(categoryContext as any)
            ? (categoryContext as PictureCategory)
            : 'gallery';

          addPicture({
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            url: dataUrl,
            category: validCat,
            caption: `Uploaded from device: ${file.name}`,
            tags: ['User Upload', String(categoryContext)],
          });
        } catch (err) {
          console.warn('Could not auto-catalog uploaded image:', err);
        }

        setUploadToast('Picture uploaded from device successfully!');
        setTimeout(() => setUploadToast(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Filter library pictures
  const filteredPictures = allLibraryPictures.filter(pic => {
    const matchesCat = libraryCategory === 'All' || pic.category === libraryCategory;
    const q = librarySearch.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesTitle = pic.title.toLowerCase().includes(q);
    const matchesTags = pic.tags?.some(t => t.toLowerCase().includes(q));
    const matchesCaption = pic.caption?.toLowerCase().includes(q);
    return matchesCat && (matchesTitle || matchesTags || matchesCaption);
  });

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'banner': return 'aspect-[21/9]';
      case 'video': return 'aspect-video';
      default: return 'aspect-video';
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Label and Header */}
      <div className="flex items-center justify-between">
        <label className="font-mono text-[10px] text-neutral-300 uppercase font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>

        <div className="flex items-center gap-2">
          {/* Pick from Library Button */}
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-[#121316] hover:bg-[#252830] text-[#00F0FF] hover:text-white border border-[#2E323B] hover:border-[#00F0FF]/40 text-[10px] font-mono font-bold transition flex items-center gap-1 shadow-sm"
          >
            <FolderOpen className="w-3 h-3 text-[#00F0FF]" />
            <span>Pictures Library ({allLibraryPictures.length})</span>
          </button>

          {/* Upload Local File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-lg bg-[#2563EB]/20 hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#2563EB]/40 text-[10px] font-mono font-bold transition flex items-center gap-1 shadow-sm"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Device File</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Input Row & Drag-and-Drop Zone */}
      <div 
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl transition-all ${
          isDragging 
            ? 'ring-2 ring-[#00F0FF] bg-[#00F0FF]/10' 
            : 'bg-[#121316]'
        }`}
      >
        <div className="flex items-center gap-2 border border-[#2E323B] focus-within:border-[#2563EB] rounded-xl px-3 py-1.5 transition">
          <LinkIcon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none text-xs font-mono py-1"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
              title="Clear Picture"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/80 border-2 border-dashed border-[#00F0FF] text-xs font-mono font-bold text-[#00F0FF] pointer-events-none">
            Drop image file here to change picture
          </div>
        )}
      </div>

      {/* Upload Toast */}
      {uploadToast && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono animate-fade-in">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadToast}</span>
        </div>
      )}

      {/* Curated Presets Bar */}
      {activePresets.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scrollbar-none text-[10px]">
          <span className="text-neutral-500 font-mono shrink-0">Sample Presets:</span>
          {activePresets.map((preset, idx) => {
            const isSelected = value === preset.url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`px-2 py-0.5 rounded-lg border whitespace-nowrap font-mono transition ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                    : 'bg-[#121316] text-neutral-400 hover:text-white border-[#2E323B] hover:border-neutral-500'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Live Image Preview Card */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-[#2E323B] bg-black group max-h-56">
          <div className={`w-full ${getAspectClass()} overflow-hidden max-h-56 flex items-center justify-center bg-neutral-950`}>
            <img
              src={value}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              onError={e => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-2.5 opacity-95">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Picture
              </span>
              {value.startsWith('data:') && (
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-[9px] font-mono text-blue-300 border border-blue-500/30">
                  Custom Upload
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-neutral-300 hover:text-white border border-white/20 transition"
                title="Enlarge preview"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-mono font-bold transition flex items-center gap-1"
                title="Change image file"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 transition"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
          {helperText}
        </p>
      )}

      {/* Fullsize Zoom Modal */}
      {isZoomOpen && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#2E323B] bg-black shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-[#2E323B] bg-[#121316]">
              <span className="text-xs font-mono text-neutral-300">Picture Lightbox Preview</span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-1 rounded-lg bg-[#1A1C20] text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center">
              <img
                src={value}
                alt="Enlarged preview"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Library Selector Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl max-h-[88vh] rounded-2xl bg-[#1A1C20] border border-[#2E323B] p-6 space-y-4 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#00F0FF]" />
                <div>
                  <h3 className="text-base font-bold text-white">Select from Pictures Library</h3>
                  <p className="text-[11px] text-neutral-400">
                    Choose from {allLibraryPictures.length} high-resolution stage, lighting, trussing, and LED media assets.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 rounded-lg bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search pictures by title, tags, or description..."
                  value={librarySearch}
                  onChange={e => setLibrarySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#121316] border border-[#2E323B] rounded-xl text-xs text-white outline-none focus:border-[#00F0FF]"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar scrollbar-none text-[11px]">
                {[
                  'All',
                  'lighting',
                  'trussing',
                  'led-screens',
                  'audio-sound',
                  'stage-boardwork',
                  'hero',
                  'portfolio',
                  'gallery'
                ].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibraryCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-mono text-xs transition ${
                      libraryCategory === cat
                        ? 'bg-[#00F0FF] text-black font-bold'
                        : 'bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B]'
                    }`}
                  >
                    {cat === 'All' ? 'All' : cat.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Library Grid */}
            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar scrollbar-none">
              {filteredPictures.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">No pictures found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredPictures.map(pic => {
                    const isSelected = value === pic.url;
                    return (
                      <div
                        key={pic.id}
                        onClick={() => {
                          onChange(pic.url);
                          setIsLibraryOpen(false);
                        }}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'ring-2 ring-[#00F0FF] border-[#00F0FF]'
                            : 'border-[#2E323B] hover:border-[#00F0FF]/50'
                        }`}
                      >
                        <div className="aspect-video w-full bg-black overflow-hidden">
                          <img
                            src={pic.url}
                            alt={pic.title}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-2 bg-[#121316] border-t border-[#2E323B]">
                          <div className="text-[11px] font-bold text-white truncate">{pic.title}</div>
                          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mt-0.5">
                            <span className="text-[#00F0FF]">{pic.category}</span>
                            {isSelected && <span className="text-emerald-400 font-bold">Selected</span>}
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#00F0FF]/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                          <span className="px-2 py-1 rounded bg-black/80 text-[10px] font-mono font-bold text-white">
                            Choose Picture
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2E323B]">
              <span className="text-[11px] font-mono text-neutral-400">
                Tip: You can also upload any image from your computer to add it to this library.
              </span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-2 bg-[#121316] hover:bg-[#252830] text-neutral-300 rounded-xl text-xs font-bold border border-[#2E323B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
