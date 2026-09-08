import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wrench, 
  Tv, 
  Volume2, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Sliders, 
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Cpu,
  PackageCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Camera
} from 'lucide-react';
import { ServiceItem, ServiceCategory, PortfolioProject } from '../types';
import { SERVICES, PORTFOLIO_PROJECTS, EQUIPMENT_INVENTORY, COMPANY_CONTACT } from '../data/mockData';
import { getServices } from '../data/adminStore';

interface ServicePageProps {
  serviceId: ServiceCategory;
  onNavigateHome: () => void;
  onNavigateService: (serviceId: ServiceCategory) => void;
  onOpenQuoteModal: (serviceId: ServiceCategory) => void;
}

export const ServicePage: React.FC<ServicePageProps> = ({
  serviceId,
  onNavigateHome,
  onNavigateService,
  onOpenQuoteModal,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(getServices());

  useEffect(() => {
    const handleUpdate = () => {
      setServicesList(getServices());
    };
    window.addEventListener('royal_concepts_admin_event', handleUpdate);
    return () => window.removeEventListener('royal_concepts_admin_event', handleUpdate);
  }, []);

  const currentService = servicesList.find(s => s.id === serviceId) || servicesList[0];
  const currentIndex = servicesList.findIndex(s => s.id === currentService.id);
  const prevService = servicesList[(currentIndex - 1 + servicesList.length) % servicesList.length];
  const nextService = servicesList[(currentIndex + 1) % servicesList.length];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [inPageQuoteSubmitted, setInPageQuoteSubmitted] = useState(false);
  const [selectedGear, setSelectedGear] = useState<string[]>([]);
  const [audienceSize, setAudienceSize] = useState('500 - 2,000 attendees');
  const [eventDate, setEventDate] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % currentService.galleryImages.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + currentService.galleryImages.length) % currentService.galleryImages.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, currentService.galleryImages.length]);

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${currentService.title} | Royal Concepts - Lights, Truss, Screens, Sound & Boardwork`;
  }, [currentService]);

  // Filter equipment belonging to this service
  const serviceEquipment = EQUIPMENT_INVENTORY.filter(eq => eq.category === currentService.id);

  // Filter projects relevant to this service
  const relatedProjects = PORTFOLIO_PROJECTS.filter(proj => {
    if (currentService.id === 'lighting') {
      return proj.equipmentUsed.some(e => e.toLowerCase().includes('light') || e.toLowerCase().includes('moving head') || e.toLowerCase().includes('beam') || e.toLowerCase().includes('co2'));
    }
    if (currentService.id === 'trussing') {
      return proj.equipmentUsed.some(e => e.toLowerCase().includes('truss') || e.toLowerCase().includes('roof') || e.toLowerCase().includes('ground support'));
    }
    if (currentService.id === 'led-screens') {
      return proj.equipmentUsed.some(e => e.toLowerCase().includes('led') || e.toLowerCase().includes('screen') || e.toLowerCase().includes('display'));
    }
    if (currentService.id === 'audio-sound') {
      return proj.equipmentUsed.some(e => e.toLowerCase().includes('sound') || e.toLowerCase().includes('line array') || e.toLowerCase().includes('sub') || e.toLowerCase().includes('midas') || e.toLowerCase().includes('mic'));
    }
    if (currentService.id === 'stage-boardwork') {
      return proj.equipmentUsed.some(e => e.toLowerCase().includes('boardwork') || e.toLowerCase().includes('stage') || e.toLowerCase().includes('riser') || e.toLowerCase().includes('runway') || e.toLowerCase().includes('deck'));
    }
    return true;
  });

  const getServiceIcon = (id: ServiceCategory, className = 'w-5 h-5') => {
    switch (id) {
      case 'lighting':
        return <Sparkles className={className} />;
      case 'trussing':
        return <Wrench className={className} />;
      case 'led-screens':
        return <Tv className={className} />;
      case 'audio-sound':
        return <Volume2 className={className} />;
      case 'stage-boardwork':
        return <Layers className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const handleToggleGear = (gearName: string) => {
    if (selectedGear.includes(gearName)) {
      setSelectedGear(selectedGear.filter(g => g !== gearName));
    } else {
      setSelectedGear([...selectedGear, gearName]);
    }
  };

  const handleInPageQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInPageQuoteSubmitted(true);
  };

  return (
    <div className="pt-20 pb-16 bg-[#0D0D0D] text-neutral-100 min-h-screen">
      {/* Top Breadcrumb & Quick Switcher Sticky Bar */}
      <div className="bg-[#121212] border-b border-[#202020] sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <button 
              onClick={onNavigateHome}
              className="hover:text-white transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF2E00]" />
              <span>Home</span>
            </button>
            <span>/</span>
            <button 
              onClick={onNavigateHome}
              className="hover:text-white transition"
            >
              Services
            </button>
            <span>/</span>
            <span className="text-white font-semibold">{currentService.title}</span>
          </div>

          {/* Quick Pillar Switcher Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {servicesList.map(s => {
              const isActive = s.id === currentService.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onNavigateService(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FF2E00] text-white shadow-md'
                      : 'bg-[#181818] text-neutral-400 hover:text-white hover:bg-[#222222]'
                  }`}
                >
                  {getServiceIcon(s.id, 'w-3.5 h-3.5')}
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-[#1C1C1C]">
        {/* Background Image with Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentService.imageUrl}
            alt={currentService.title}
            className="w-full h-full object-cover filter brightness-[0.22] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#FF2E00]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Pillar Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818]/90 border border-[#2B2B2B] text-xs font-mono font-bold text-[#FF2E00]">
              {getServiceIcon(currentService.id, 'w-3.5 h-3.5 text-[#FF2E00]')}
              <span>PILLAR 0{currentIndex + 1} OF 05 • TECHNICAL DISCIPLINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {currentService.title}
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-300 font-medium leading-snug">
              {currentService.subtitle}
            </p>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed pt-2">
              {currentService.longDescription}
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenQuoteModal(currentService.id)}
                className="px-6 py-3 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#FF2E00]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Request {currentService.title} Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${COMPANY_CONTACT.phones[0].raw}`}
                className="px-5 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#242424] border border-[#2E2E2E] text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FF2E00]" />
                <span>Call Dispatch: {COMPANY_CONTACT.phones[0].number}</span>
              </a>

              <a
                href={`https://wa.me/256702615454?text=${encodeURIComponent(`Hello Royal Concepts, I am inquiring about booking your ${currentService.title} service for an upcoming event.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-sm transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Hero Statistics Ribbon */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentService.heroStats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-[#141414]/90 backdrop-blur-md border border-[#242424] rounded-2xl p-4 sm:p-5 hover:border-[#383838] transition shadow-lg"
              >
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight text-[#FF2E00]">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-200 mt-1">
                  {stat.label}
                </div>
                {stat.helper && (
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {stat.helper}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Section 1: System Architecture & Deployment Capabilities */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1C1C1C] pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider mb-1">
                ENGINEERED SPECIFICATIONS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Capabilities & Technical Architecture
              </h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              Every deployment is backed by certified engineering, redundant signal routing, and safety-certified rigging protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentService.capabilities.map((cap, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-[#131313] border border-[#222222] hover:border-[#333333] transition space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400 font-bold">
                    CAPABILITY 0{i + 1}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#FF2E00]" />
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {cap}
                </p>
                <div className="pt-2 border-t border-[#1c1c1c] flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Royal Standard Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Dedicated Equipment Roster */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1C1C1C] pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-1">
                IN-HOUSE RENTAL INVENTORY
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Specialized {currentService.title} Hardware
              </h2>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              Fully owned stock ready for rapid dispatch across East Africa
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {serviceEquipment.map((gear) => (
              <div
                key={gear.id}
                className="bg-[#121212] border border-[#222222] rounded-2xl p-6 hover:border-[#333333] transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#1C1C1C] text-neutral-300">
                        {gear.model}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1.5">
                        {gear.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FF2E00]/15 border border-[#FF2E00]/30 text-[#FF2E00] text-xs font-mono font-bold whitespace-nowrap">
                      {gear.availableUnits} in stock
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {gear.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#1C1C1C]">
                  <div className="text-[11px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                    Key Technical Parameters:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-300">
                    {gear.specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E00]" />
                        <span className="line-clamp-1">{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleGear(gear.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedGear.includes(gear.name)
                        ? 'bg-[#FF2E00] text-white'
                        : 'bg-[#1C1C1C] text-neutral-300 hover:bg-[#262626]'
                    }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>{selectedGear.includes(gear.name) ? 'Selected for Quote' : 'Add to Event Quote'}</span>
                  </button>

                  <button
                    onClick={() => onOpenQuoteModal(currentService.id)}
                    className="text-xs text-[#FF2E00] hover:underline font-semibold"
                  >
                    Book This Gear →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: 10-Photo Field Deployment Gallery */}
        <div id="service-gallery" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1C1C1C] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>FIELD ARCHIVE • {currentService.galleryImages.length} PRODUCTION PHOTOS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {currentService.title} Photo Showcase
              </h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm sm:text-right">
              Explore 10 high-resolution field photos from our live event deployments. Click any image to enlarge.
            </p>
          </div>

          {/* 10-Photo Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {currentService.galleryImages.map((imgUrl, imgIdx) => (
              <button
                key={imgIdx}
                type="button"
                onClick={() => setActiveLightboxIndex(imgIdx)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#141414] border border-[#222222] hover:border-[#FF2E00] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF2E00]/10 text-left focus:outline-none"
                aria-label={`View ${currentService.title} photo ${imgIdx + 1} of ${currentService.galleryImages.length}`}
              >
                <img
                  src={imgUrl}
                  alt={`${currentService.title} deployment photo ${imgIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                {/* Photo Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-mono font-bold text-neutral-200 border border-white/10">
                  {imgIdx + 1} / {currentService.galleryImages.length}
                </div>

                {/* Hover overlay icon */}
                <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-[#FF2E00] text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Engineering & Deployment Workflow */}
        <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider">
              EXECUTION RIGOR
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How Royal Concepts Deploys {currentService.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              A systematic 6-phase engineering workflow ensuring safety, punctuality, and show-stopping artistic execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Site Survey & 3D Staging CAD',
                desc: 'Detailed physical measurement of the venue or festival grounds, load-bearing ceiling assessments, and 3D visual staging simulations.',
              },
              {
                step: '02',
                title: 'Rigging & Power Load Calculations',
                desc: 'Precise structural tension modeling, wind-load resistance calculations, and 3-phase electrical distribution phase balancing.',
              },
              {
                step: '03',
                title: 'Logistics & Safe Load-In',
                desc: 'Coordinated convoy transport in flight cases, scheduled load-in, floor protection laid down, and safety outriggers locked into place.',
              },
              {
                step: '04',
                title: 'Calibration & Cue Programming',
                desc: 'Hardware alignment, optical focus, Smaart acoustic alignment, NovaStar screen mapping, or DMX timecode cue programming.',
              },
              {
                step: '05',
                title: 'Live Show Execution & Standby',
                desc: 'Certified engineers live at the control desks with hot-spare backup equipment and emergency redundant signal loops on standby.',
              },
              {
                step: '06',
                title: 'Synchronized Strike & Pack-Down',
                desc: 'Careful de-rigging in accordance with safety codes, thorough hardware inspection, site sweep, and zero venue damage.',
              },
            ].map((st) => (
              <div 
                key={st.step} 
                className="p-5 rounded-2xl bg-[#181818] border border-[#262626] space-y-2 relative overflow-hidden"
              >
                <div className="text-2xl font-black font-mono text-[#FF2E00]/40">
                  {st.step}
                </div>
                <h3 className="text-base font-bold text-white">
                  {st.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Ideal Event Applications & Safety Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ideal Applications */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121212] border border-[#222222] space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
                VERSATILITY
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Ideal Event Deployments
              </h3>
            </div>
            <div className="space-y-3">
              {currentService.idealFor.map((app, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#181818] border border-[#262626] text-sm text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Standards */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121212] border border-[#222222] space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider">
                SAFETY FIRST
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Safety & Compliance Measures
              </h3>
            </div>
            <div className="space-y-3">
              {currentService.safetyStandards.map((std, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#181818] border border-[#262626] text-sm text-neutral-200">
                  <ShieldCheck className="w-4 h-4 text-[#FF2E00] shrink-0" />
                  <span>{std}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Real Projects & Case Studies featuring this Service */}
        {relatedProjects.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1C1C1C] pb-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider mb-1">
                  FIELD EVIDENCE
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {currentService.title} in Action
                </h2>
              </div>
              <div className="text-xs text-neutral-400">
                Major East African events powered by our {currentService.title.toLowerCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#383838] transition flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-black">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-[#FF2E00] border border-white/10">
                      {proj.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        {proj.venue} • {proj.attendance}
                      </p>
                      <p className="text-xs text-neutral-300 mt-2 line-clamp-3">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1C1C1C]">
                      <span className="text-[10px] font-mono uppercase text-[#00F0FF] block mb-1">
                        Equipment Deployed:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {proj.equipmentUsed.map((eq, i) => (
                          <span key={i} className="text-[10px] bg-[#181818] px-2 py-0.5 rounded text-neutral-300">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: In-Page Dedicated Quote Request Form */}
        <div id="service-quote-box" className="bg-[#141414] border border-[#262626] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider">
              FAST-TRACK PRICING
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Request a Custom Quote for {currentService.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Provide event details below. Our production managers will review your venue parameters and furnish a customized technical proposal within 2 hours.
            </p>
          </div>

          {inPageQuoteSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#1A1A1A] border border-[#25D366]/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Inquiry Received for {currentService.title}!
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                Thank you, <span className="text-white font-bold">{clientName}</span>. Our lead rigging engineer will reach out to you via <span className="font-mono text-[#FF2E00]">{clientPhone}</span> shortly.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setInPageQuoteSubmitted(false);
                    setSelectedGear([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#222222] text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInPageQuoteSubmit} className="space-y-6">
              {/* Selected Hardware Chips */}
              {selectedGear.length > 0 && (
                <div className="p-4 rounded-xl bg-[#181818] border border-[#2C2C2C] space-y-2">
                  <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider block">
                    Selected Equipment ({selectedGear.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedGear.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#222222] text-xs font-medium text-white border border-[#333333]"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleGear(item)}
                          className="text-neutral-400 hover:text-[#FF2E00]"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Your Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Bosco / Nile Media"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] text-white focus:outline-none focus:border-[#FF2E00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 0772 615 454"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] text-white focus:outline-none focus:border-[#FF2E00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] text-white focus:outline-none focus:border-[#FF2E00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Venue / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    placeholder="e.g. Serena Hotel / Lugogo Oval"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] text-white focus:outline-none focus:border-[#FF2E00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Estimated Audience Size
                  </label>
                  <select
                    value={audienceSize}
                    onChange={(e) => setAudienceSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] text-white focus:outline-none focus:border-[#FF2E00]"
                  >
                    <option value="Under 200 (Intimate / VIP)">Under 200 (Intimate / VIP)</option>
                    <option value="200 - 800 (Conference / Gala)">200 - 800 (Conference / Gala)</option>
                    <option value="800 - 3,000 (Hall / Arena)">800 - 3,000 (Hall / Arena)</option>
                    <option value="3,000 - 15,000 (Festival / Grounds)">3,000 - 15,000 (Festival / Grounds)</option>
                    <option value="15,000+ (Mega Stadium / Crusade)">15,000+ (Mega Stadium / Crusade)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Direct Contact Hotline
                  </label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-[#2E2E2E] text-[#FF2E00] font-mono font-bold flex items-center justify-between">
                    <span>0772 615 454</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Dispatch</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                  Specific Requirements or Technical Riders (Optional)
                </label>
                <textarea
                  rows={3}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder={`Mention specific ${currentService.title.toLowerCase()} preferences, ceiling height, outdoor weather coverage, or power setup...`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] text-white text-xs focus:outline-none focus:border-[#FF2E00]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                  <span>No obligation quote • 2-hour response guarantee</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-[#FF2E00]/25"
                >
                  Submit {currentService.title} Request
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 7: Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="border-b border-[#1C1C1C] pb-4">
            <div className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider mb-1">
              COMMONLY ASKED QUESTIONS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {currentService.title} FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {currentService.faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#161616] transition"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#FF2E00] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-[#1C1C1C]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 8: Next & Previous Service Navigation */}
        <div className="border-t border-[#1C1C1C] pt-12 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>EXPLORE OTHER ROYAL CONCEPTS DISCIPLINES</span>
            <span>0{currentIndex + 1} / 05</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous Service */}
            <button
              onClick={() => onNavigateService(prevService.id)}
              className="group p-5 rounded-2xl bg-[#131313] hover:bg-[#181818] border border-[#222222] hover:border-[#383838] transition text-left flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#1C1C1C] text-neutral-300 group-hover:text-[#FF2E00] transition">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Previous Discipline
                  </span>
                  <span className="text-base font-bold text-white group-hover:text-[#FF2E00] transition">
                    {prevService.title}
                  </span>
                </div>
              </div>
            </button>

            {/* Next Service */}
            <button
              onClick={() => onNavigateService(nextService.id)}
              className="group p-5 rounded-2xl bg-[#131313] hover:bg-[#181818] border border-[#222222] hover:border-[#383838] transition text-right flex items-center justify-between gap-4 flex-row-reverse"
            >
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="p-3 rounded-xl bg-[#1C1C1C] text-neutral-300 group-hover:text-[#FF2E00] transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Next Discipline
                  </span>
                  <span className="text-base font-bold text-white group-hover:text-[#FF2E00] transition">
                    {nextService.title}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* 10-Photo Full-Screen Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in select-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentService.title} photo gallery`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-neutral-300 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#FF2E00] bg-[#FF2E00]/10 px-2.5 py-1 rounded border border-[#FF2E00]/20">
                {currentService.title}
              </span>
              <span className="text-xs sm:text-sm font-mono text-neutral-400">
                Photo {activeLightboxIndex + 1} of {currentService.galleryImages.length}
              </span>
            </div>

            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white transition border border-[#333333] flex items-center gap-1.5 text-xs font-bold"
              aria-label="Close photo preview"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close (Esc)</span>
            </button>
          </div>

          {/* Center Stage with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              onClick={() => setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + currentService.galleryImages.length) % currentService.galleryImages.length : 0))}
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/70 hover:bg-[#FF2E00] text-white transition border border-white/10 hover:border-transparent"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Main Photo */}
            <img
              src={currentService.galleryImages[activeLightboxIndex]}
              alt={`${currentService.title} full resolution photo ${activeLightboxIndex + 1}`}
              className="max-h-[68vh] max-w-[88vw] w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-300 border border-[#222222]"
            />

            {/* Next Button */}
            <button
              onClick={() => setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % currentService.galleryImages.length : 0))}
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/70 hover:bg-[#FF2E00] text-white transition border border-white/10 hover:border-transparent"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Filmstrip (All 10 Photos) */}
          <div className="pt-2 border-t border-neutral-800 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-center gap-2 min-w-max mx-auto px-2">
              {currentService.galleryImages.map((thumbUrl, tIdx) => (
                <button
                  key={tIdx}
                  onClick={() => setActiveLightboxIndex(tIdx)}
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden transition-all ${
                    activeLightboxIndex === tIdx
                      ? 'ring-2 ring-[#FF2E00] scale-105 opacity-100'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                  aria-label={`Jump to photo ${tIdx + 1}`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${tIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono font-bold bg-black/80 px-1 rounded text-white">
                    {tIdx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
