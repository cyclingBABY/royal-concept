import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowRight, ChevronDown, Sparkles, Wrench, Tv, Volume2, Layers } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_CONTACT, SERVICES } from '../data/mockData';
import { getServices } from '../data/adminStore';
import { ServiceCategory, ServiceItem } from '../types';

interface NavbarProps {
  onOpenQuote: () => void;
  activeServiceId?: ServiceCategory | null;
  onNavigateHome: () => void;
  onNavigateService: (serviceId: ServiceCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenQuote,
  activeServiceId,
  onNavigateHome,
  onNavigateService,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(getServices());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phonesDropdownOpen, setPhonesDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setServicesList(getServices());
    };
    window.addEventListener('royal_concepts_admin_event', handleUpdate);
    return () => window.removeEventListener('royal_concepts_admin_event', handleUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getServiceIcon = (id: ServiceCategory) => {
    switch (id) {
      case 'lighting':
        return <Sparkles className="w-3.5 h-3.5 text-[#FF2E00]" />;
      case 'trussing':
        return <Wrench className="w-3.5 h-3.5 text-[#00F0FF]" />;
      case 'led-screens':
        return <Tv className="w-3.5 h-3.5 text-[#FF2E00]" />;
      case 'audio-sound':
        return <Volume2 className="w-3.5 h-3.5 text-[#00F0FF]" />;
      case 'stage-boardwork':
        return <Layers className="w-3.5 h-3.5 text-[#FF2E00]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#FF2E00]" />;
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (activeServiceId) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#222222] shadow-xl py-3'
          : 'bg-gradient-to-b from-[#0D0D0D]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={onNavigateHome} 
          className="group flex items-center text-left"
        >
          <Logo size="md" showTagline={true} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-neutral-300">
          <a
            href="#hero"
            onClick={(e) => handleSectionClick(e, '#hero')}
            className={`transition-colors tracking-wide relative py-1 ${!activeServiceId ? 'text-white' : 'hover:text-white'}`}
          >
            Home
          </a>

          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              onClick={() => {
                if (activeServiceId) {
                  onNavigateHome();
                } else {
                  setServicesDropdownOpen(!servicesDropdownOpen);
                }
              }}
              className={`flex items-center gap-1.5 transition-colors tracking-wide py-1 ${
                activeServiceId ? 'text-[#FF2E00]' : 'hover:text-white'
              }`}
            >
              <span>Services</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Dropdown Menu for all 5 Services */}
            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-72 z-50">
                <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl shadow-2xl p-2 text-xs space-y-1">
                  <div className="px-3 py-1.5 border-b border-[#222222] flex items-center justify-between text-[11px] font-mono text-neutral-400 font-bold uppercase">
                    <span>Individual Service Pages</span>
                    <span className="text-[#FF2E00]">5 Disciplines</span>
                  </div>

                  {servicesList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onNavigateService(s.id);
                        setServicesDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl transition text-left ${
                        activeServiceId === s.id
                          ? 'bg-[#FF2E00]/15 border border-[#FF2E00]/30 text-white'
                          : 'hover:bg-[#1C1C1C] text-neutral-200'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-[#222222] shrink-0 mt-0.5">
                        {getServiceIcon(s.id)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{s.title}</span>
                          {activeServiceId === s.id && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF2E00] text-white">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1">
                          {s.tagline}
                        </div>
                      </div>
                    </button>
                  ))}

                  <div className="pt-1 border-t border-[#222222]">
                    <a
                      href="#services"
                      onClick={(e) => {
                        setServicesDropdownOpen(false);
                        handleSectionClick(e, '#services');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition text-[11px] font-semibold"
                    >
                      <span>View All Services Grid</span>
                      <ArrowRight className="w-3 h-3 text-[#FF2E00]" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href="#portfolio"
            onClick={(e) => handleSectionClick(e, '#portfolio')}
            className="hover:text-white transition-colors tracking-wide py-1"
          >
            Portfolio
          </a>

          <a
            href="#equipment"
            onClick={(e) => handleSectionClick(e, '#equipment')}
            className="hover:text-white transition-colors tracking-wide py-1"
          >
            Equipment
          </a>

          <a
            href="#contact"
            onClick={(e) => handleSectionClick(e, '#contact')}
            className="hover:text-white transition-colors tracking-wide py-1"
          >
            Contact
          </a>
        </nav>

        {/* Action buttons on desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Call Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPhonesDropdownOpen(!phonesDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#181818] border border-[#2a2a2a] text-neutral-200 hover:border-[#FF2E00]/50 hover:text-white transition text-xs font-mono"
              aria-expanded={phonesDropdownOpen}
            >
              <Phone className="w-3.5 h-3.5 text-[#FF2E00]" />
              <span className="font-bold">0772 615 454</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {phonesDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#141414] border border-[#2d2d2d] rounded-xl shadow-2xl p-2 z-50 text-xs animate-fade-in"
                onMouseLeave={() => setPhonesDropdownOpen(false)}
              >
                <div className="px-2.5 py-1.5 border-b border-[#242424] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Royal Concepts Hotlines
                </div>
                {COMPANY_CONTACT.phones.map(phone => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number.replace(/\s+/g, '')}`}
                    className="flex flex-col px-2.5 py-2 rounded-lg hover:bg-[#202020] text-white transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#FF2E00] group-hover:underline">
                        {phone.number}
                      </span>
                      {phone.isPrimary && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF2E00]/20 text-[#FF2E00] font-sans font-bold">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400">{phone.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            id="nav-get-quote-btn"
            onClick={onOpenQuote}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FF2E00]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Event Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-quote-btn"
            onClick={onOpenQuote}
            className="px-3 py-1.5 rounded-lg bg-[#FF2E00] text-white text-xs font-bold sm:hidden"
          >
            Quote
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#181818] border border-[#2a2a2a] text-neutral-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-b border-[#262626] px-5 py-5 space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar scrollbar-none">
          <nav className="flex flex-col space-y-2 font-semibold text-neutral-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateHome();
              }}
              className="py-2 text-left text-base hover:text-[#FF2E00] transition"
            >
              Home
            </button>

            {/* Mobile Service Pages List */}
            <div className="py-2 space-y-1.5 border-y border-[#222222]">
              <div className="text-[11px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                Services (Dedicated Pages)
              </div>
              <div className="grid grid-cols-1 gap-1 pt-1">
                {servicesList.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateService(s.id);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-left text-xs font-semibold ${
                      activeServiceId === s.id ? 'bg-[#FF2E00] text-white' : 'bg-[#181818] text-neutral-300 hover:text-white'
                    }`}
                  >
                    {getServiceIcon(s.id)}
                    <span>{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <a
              href="#portfolio"
              onClick={(e) => handleSectionClick(e, '#portfolio')}
              className="py-2 text-base hover:text-[#FF2E00] transition"
            >
              Project Portfolio
            </a>

            <a
              href="#equipment"
              onClick={(e) => handleSectionClick(e, '#equipment')}
              className="py-2 text-base hover:text-[#FF2E00] transition"
            >
              Equipment Catalog
            </a>

            <a
              href="#contact"
              onClick={(e) => handleSectionClick(e, '#contact')}
              className="py-2 text-base hover:text-[#FF2E00] transition"
            >
              Contact & Inquiries
            </a>
          </nav>

          <div className="pt-3 border-t border-[#222222] space-y-3">
            <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Direct Contact Numbers:
            </p>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
              {COMPANY_CONTACT.phones.map(phone => (
                <a
                  key={phone.number}
                  href={`tel:${phone.number.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#181818] text-neutral-200 hover:text-white"
                >
                  <span className="font-bold text-[#FF2E00]">{phone.number}</span>
                  <span className="text-[10px] text-neutral-400">{phone.label}</span>
                </a>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3 rounded-xl bg-[#FF2E00] text-white font-bold text-sm text-center shadow-lg shadow-[#FF2E00]/25 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Get Event Quote Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
