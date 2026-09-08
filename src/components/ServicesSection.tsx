import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wrench, 
  Tv, 
  Volume2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  Camera,
  Images
} from 'lucide-react';
import { SERVICES } from '../data/mockData';
import { getServices } from '../data/adminStore';
import { ServiceItem, ServiceCategory } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (service: ServiceCategory) => void;
  onNavigateToServicePage?: (service: ServiceCategory) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForQuote,
  onNavigateToServicePage,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(getServices());
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);
  const [activeModalPhotoIndex, setActiveModalPhotoIndex] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => {
      setServicesList(getServices());
    };
    window.addEventListener('royal_concepts_admin_event', handleUpdate);
    return () => window.removeEventListener('royal_concepts_admin_event', handleUpdate);
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#FF2E00]" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-[#00F0FF]" />;
      case 'Tv':
        return <Tv className="w-6 h-6 text-[#FF2E00]" />;
      case 'Volume2':
        return <Volume2 className="w-6 h-6 text-[#00F0FF]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#FF2E00]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#FF2E00]" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-[#0D0D0D] border-t border-[#1C1C1C] relative">
      {/* Decorative gradient beam */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF2E00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#262626] text-xs font-mono font-semibold text-[#FF2E00]">
              CORE DISCIPLINES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What We Do
            </h2>
            <p className="text-neutral-400 max-w-2xl text-base">
              Precision event production across 5 specialized pillars. Fully owned rental inventory, certified structural riggers, and seasoned sound and lighting engineers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">Click cards for technical gear specs & deployment details</span>
          </div>
        </div>

        {/* 5 Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => {
            const isSpanTwo = index === 0 || index === 4;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`group relative bg-[#121212] hover:bg-[#161616] border border-[#202020] hover:border-[#333333] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isSpanTwo ? 'lg:col-span-1' : ''
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
                  
                  {/* Category Accent Badge */}
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#121212]/90 backdrop-blur-md border border-[#2A2A2A] shadow-md">
                    {getServiceIcon(service.iconName)}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      Pillar 0{index + 1}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#FF2E00]" />
                      <span>{service.galleryImages.length} Photos</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onNavigateToServicePage && onNavigateToServicePage(service.id)}
                        className="text-left group/title"
                      >
                        <h3 className="text-xl font-bold text-white group-hover/title:text-[#FF2E00] transition-colors flex items-center gap-1.5">
                          <span>{service.title}</span>
                          <ArrowRight className="w-4 h-4 text-[#FF2E00] opacity-0 group-hover/title:opacity-100 transition-opacity" />
                        </h3>
                      </button>
                    </div>
                    <p className="text-xs font-medium text-neutral-400 mt-1">
                      {service.tagline}
                    </p>
                    <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-1.5 pt-2 border-t border-[#1C1C1C]">
                    {service.specs.slice(0, 3).map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2E00] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {onNavigateToServicePage ? (
                      <button
                        onClick={() => onNavigateToServicePage(service.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#2D2D2D] hover:border-[#FF2E00]/50"
                      >
                        <span>Explore Full Page</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF2E00]" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedServiceDetail(service)}
                        className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition"
                      >
                        <span>Tech Specs</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#FF2E00]" />
                      </button>
                    )}

                    <button
                      onClick={() => onSelectServiceForQuote(service.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#FF2E00]/15 hover:bg-[#FF2E00] text-[#FF2E00] hover:text-white text-xs font-bold transition-all border border-[#FF2E00]/30 hover:border-[#FF2E00] text-center"
                    >
                      Book Gear
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#121212] border border-[#2B2B2B] rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
            {/* Modal Image Header */}
            <div className="relative h-60 sm:h-72 w-full bg-black">
              <img
                src={selectedServiceDetail.galleryImages[activeModalPhotoIndex] || selectedServiceDetail.imageUrl}
                alt={selectedServiceDetail.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/30" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-[11px] font-mono font-bold text-white border border-white/10 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#FF2E00]" />
                  <span>Photo {activeModalPhotoIndex + 1} of {selectedServiceDetail.galleryImages.length}</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedServiceDetail(null);
                  setActiveModalPhotoIndex(0);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-white backdrop-blur-sm transition border border-white/10"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider">
                  Technical Architecture • 10 Field Photos
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {selectedServiceDetail.title}
                </h3>
              </div>
            </div>

            {/* 10-Photo Interactive Filmstrip */}
            <div className="bg-[#0A0A0A] px-6 py-3 border-b border-[#202020]">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                <span className="flex items-center gap-1.5 text-neutral-300 font-bold">
                  <Images className="w-3.5 h-3.5 text-[#FF2E00]" />
                  10 PRODUCTION PHOTOS (CLICK TO SWITCH):
                </span>
                <span>{activeModalPhotoIndex + 1}/10</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {selectedServiceDetail.galleryImages.map((photoUrl, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setActiveModalPhotoIndex(pIdx)}
                    className={`relative w-12 h-9 sm:w-14 sm:h-10 rounded-lg overflow-hidden shrink-0 transition-all ${
                      activeModalPhotoIndex === pIdx
                        ? 'ring-2 ring-[#FF2E00] scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-90'
                    }`}
                    aria-label={`View photo ${pIdx + 1}`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Photo thumbnail ${pIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 text-[8px] font-mono font-bold bg-black/80 px-1 text-white">
                      {pIdx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  System Overview
                </h4>
                <p className="text-sm text-neutral-200 leading-relaxed">
                  {selectedServiceDetail.description}
                </p>
              </div>

              {/* Equipment Specifications List */}
              <div className="p-4 bg-[#181818] rounded-xl border border-[#262626] space-y-2">
                <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#FF2E00]" />
                  Inventory & Hardware Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {selectedServiceDetail.specs.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-neutral-300">
                      <span className="text-[#FF2E00] font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Capabilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Deployment Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedServiceDetail.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#222222] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {onNavigateToServicePage ? (
                  <button
                    onClick={() => {
                      const id = selectedServiceDetail.id;
                      setSelectedServiceDetail(null);
                      onNavigateToServicePage(id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-xs font-bold text-white flex items-center justify-center gap-2 border border-[#333333] transition"
                  >
                    <span>Open Dedicated {selectedServiceDetail.title} Page</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF2E00]" />
                  </button>
                ) : <div />}

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedServiceDetail(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#2a2a2a] text-xs font-semibold text-neutral-300 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const id = selectedServiceDetail.id;
                      setSelectedServiceDetail(null);
                      onSelectServiceForQuote(id);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-xs font-extrabold text-white uppercase tracking-wider transition shadow-lg shadow-[#FF2E00]/25"
                  >
                    Request {selectedServiceDetail.title}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
