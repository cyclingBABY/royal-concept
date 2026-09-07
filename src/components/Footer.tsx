import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, Instagram, Facebook, Youtube, ShieldCheck, Lock } from 'lucide-react';
import { COMPANY_CONTACT } from '../data/mockData';
import { Logo } from './Logo';
import { ServiceCategory } from '../types';

interface FooterProps {
  onNavigateService?: (serviceId: ServiceCategory) => void;
  onNavigateHome?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateService,
  onNavigateHome,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (onNavigateHome) {
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
    <footer className="bg-[#080808] border-t border-[#1C1C1C] text-neutral-400 text-xs">
      {/* Top phone bar banner */}
      <div className="border-b border-[#181818] bg-[#0E0E0E] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-neutral-300 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF2E00]" />
            <span>24/7 EVENT HOTLINES:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs">
            {COMPANY_CONTACT.phones.map(phone => (
              <a
                key={phone.number}
                href={`tel:${phone.number.replace(/\s+/g, '')}`}
                className="text-white hover:text-[#FF2E00] font-bold transition tracking-wider flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF2E00]" />
                <span>{phone.number}</span>
              </a>
            ))}
          </div>
          <a
            href="https://wa.me/256702615454"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#25D366] hover:underline"
          >
            Direct WhatsApp Desk →
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" showTagline={false} />
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Royal Concepts is Uganda's premier event production, structural rigging, pitch LED screens, lighting systems, pro sound, and custom stage boardwork engineering firm.
            </p>
            <div className="p-3 bg-[#121212] rounded-xl border border-[#202020] text-[11px] text-neutral-300 font-medium">
              <span className="text-[#FF2E00] font-bold block mb-0.5">Specializing In:</span>
              Lights, Truss, Screens, Sound and Custom Boardwork
            </div>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              Individual Service Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateService && onNavigateService('lighting')}
                  className="hover:text-white hover:text-[#FF2E00] transition text-left"
                >
                  Lighting Systems & Intelligent Moving Heads →
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateService && onNavigateService('trussing')}
                  className="hover:text-white hover:text-[#00F0FF] transition text-left"
                >
                  Aluminum Box Trussing & Heavy Rigging →
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateService && onNavigateService('led-screens')}
                  className="hover:text-white hover:text-[#FF2E00] transition text-left"
                >
                  P2.9 & P3.9 HD LED Display Video Walls →
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateService && onNavigateService('audio-sound')}
                  className="hover:text-white hover:text-[#00F0FF] transition text-left"
                >
                  Concert Line Arrays & Live Digital Sound →
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateService && onNavigateService('stage-boardwork')}
                  className="hover:text-white hover:text-[#FF2E00] transition text-left"
                >
                  Custom Stage Platforms & Bespoke Boardwork →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="#hero" 
                  onClick={(e) => handleSectionClick(e, '#hero')}
                  className="hover:text-white transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => handleSectionClick(e, '#services')}
                  className="hover:text-white transition"
                >
                  What We Do Grid
                </a>
              </li>
              <li>
                <a 
                  href="#portfolio" 
                  onClick={(e) => handleSectionClick(e, '#portfolio')}
                  className="hover:text-white transition"
                >
                  Portfolio & Case Studies
                </a>
              </li>
              <li>
                <a 
                  href="#equipment" 
                  onClick={(e) => handleSectionClick(e, '#equipment')}
                  className="hover:text-white transition"
                >
                  Equipment Inventory
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => handleSectionClick(e, '#contact')}
                  className="hover:text-white transition"
                >
                  Contact & Hotlines
                </a>
              </li>
              <li className="pt-2 border-t border-[#1C1C1C]">
                <button
                  onClick={onOpenAdmin}
                  className="font-mono text-neutral-400 hover:text-[#FF2E00] transition text-left flex items-center gap-1.5 group cursor-pointer"
                  title="Code5 Staff & Admin Console (code5@royal)"
                  aria-label="Code5 Admin Login"
                >
                  <Lock className="w-3 h-3 text-[#FF2E00] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white group-hover:text-[#FF2E00]">code5@royal</span>
                  <span className="text-[10px] text-neutral-500 font-sans">(Admin)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Phone Contact Card */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              Official Contact Numbers
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-white font-bold">0772 615 454 <span className="font-sans text-[10px] text-neutral-400 font-normal">(Primary Call Line)</span></div>
              <div className="text-white font-bold">0702 615 454 <span className="font-sans text-[10px] text-[#25D366] font-semibold">(Official WhatsApp)</span></div>
              <div className="text-white font-bold">0702 838 474 <span className="font-sans text-[10px] text-neutral-400 font-normal">(Rigging Logistics)</span></div>
            </div>
            <div className="pt-2 text-[11px] text-neutral-400">
              <p>Kampala, Uganda</p>
              <p className="text-neutral-500">Fast mobilization across East Africa</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Royal Concepts. All rights reserved. Stage, Rigging, LED & Sound.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-neutral-400 hidden sm:inline">Lights • Truss • Screens • Sound • Boardwork</span>
            
            {/* code5@royal Admin Login Button */}
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1 rounded-lg bg-[#141414] hover:bg-[#202020] text-neutral-400 hover:text-[#FF2E00] border border-[#222222] hover:border-[#FF2E00]/40 transition font-mono text-xs flex items-center gap-1.5 cursor-pointer"
              title="Admin Login (code5@royal)"
            >
              <Lock className="w-3 h-3 text-[#FF2E00]" />
              <span className="font-bold text-white hover:text-[#FF2E00]">code5@royal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-neutral-400 hover:text-white transition"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
