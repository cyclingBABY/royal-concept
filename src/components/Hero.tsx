import React from 'react';
import { ArrowRight, Calendar, Sparkles, ShieldCheck, Phone, CheckCircle2, Play } from 'lucide-react';
import { COMPANY_CONTACT } from '../data/mockData';
import { Logo } from './Logo';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden stage-grid">
      {/* Background visual overlay with stage lighting ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=80"
          alt="Concert Stage Lighting and Truss Rigging"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125"
        />
        {/* Sleek radial and linear gradients for deep dark background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/75 to-transparent" />
        {/* Subtle orange-red spotlight glow from upper right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF2E00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-48 w-80 h-80 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Live capability pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] text-xs font-semibold text-neutral-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#FF2E00] animate-ping" />
              <span className="text-[#FF2E00] font-bold uppercase tracking-wider">Royal Concepts</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300">Stage, Rigging, LED & Sound</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-neutral-400">Unforgettable Stage</span> &{' '}
              <span className="text-[#FF2E00] relative inline-block">
                Event Experiences
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#FF2E00]/60" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 4 Q 50 8 100 4" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Full-scale production, structural rigging, pitch LED walls, dynamic lighting, and custom stage builds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-book-equipment-btn"
                onClick={onOpenQuote}
                className="px-7 py-4 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-[#FF2E00]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5"
              >
                <span>Book Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="hero-view-work-btn"
                href="#portfolio"
                className="px-7 py-4 rounded-xl bg-[#171717] hover:bg-[#222222] border border-[#2B2B2B] text-white font-bold text-sm tracking-wide transition-all hover:border-neutral-500 flex items-center gap-2"
              >
                <span>View Our Work</span>
              </a>

              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/256702615454?text=${encodeURIComponent('Hello Royal Concepts, I would like to inquire about event stage, lighting and rigging equipment.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-semibold text-sm transition flex items-center gap-2"
                title="Direct WhatsApp"
              >
                <span>WhatsApp: 0702 615 454</span>
              </a>
            </div>

            {/* Core Capability Badges */}
            <div className="pt-4 border-t border-[#1F1F1F] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2 bg-[#141414] p-2.5 rounded-lg border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#FF2E00] shrink-0" />
                <span className="font-semibold">DMX Moving Heads</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] p-2.5 rounded-lg border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="font-semibold">P2.9 & P3.9 LED</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] p-2.5 rounded-lg border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#FF2E00] shrink-0" />
                <span className="font-semibold">F34 Heavy Truss</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] p-2.5 rounded-lg border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="font-semibold">Custom Boardwork</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Official Card Visual & Quick Specs */}
          <div className="lg:col-span-5 space-y-4">
            {/* The Brand Monogram Card recreating the user's provided official badge */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF2E00]/30 to-[#00F0FF]/30 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-[#111111] border border-[#262626] rounded-2xl p-6 sm:p-7 shadow-2xl text-white">
                {/* Official business card style layout */}
                <div className="border border-[#2f2f2f] rounded-2xl p-5 bg-[#0A0A0A] flex flex-col sm:flex-row items-center gap-5">
                  <div className="shrink-0 p-2 bg-[#161616] rounded-xl border border-[#282828]">
                    <Logo size="lg" variant="compact" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs uppercase tracking-widest text-[#FF2E00] font-mono font-bold">
                      OFFICIAL GEAR DEPOT
                    </p>
                    <p className="text-sm font-semibold text-neutral-300 mt-1">
                      Lights • Truss • Screens • Sound • Boardwork
                    </p>
                  </div>
                </div>

                {/* Hotlines direct strip */}
                <div className="mt-5 pt-4 border-t border-[#202020] space-y-2">
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                    Official Production Hotlines:
                  </p>
                  <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                    {COMPANY_CONTACT.phones.map((phone, idx) => (
                      <a
                        key={phone.number}
                        href={`tel:${phone.number.replace(/\s+/g, '')}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#161616] hover:bg-[#202020] border border-[#242424] transition group"
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#FF2E00] group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-white tracking-wider">{phone.number}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400">{phone.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Fast quote banner inside card */}
                <button
                  onClick={onOpenQuote}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2E00] to-[#e62900] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Date & Gear Availability</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#121212] border border-[#202020] rounded-xl p-3">
                <p className="text-xl font-black text-white font-mono">500+</p>
                <p className="text-[11px] text-neutral-400 font-medium">Stages Built</p>
              </div>
              <div className="bg-[#121212] border border-[#202020] rounded-xl p-3">
                <p className="text-xl font-black text-[#FF2E00] font-mono">100%</p>
                <p className="text-[11px] text-neutral-400 font-medium">Rigging Safety</p>
              </div>
              <div className="bg-[#121212] border border-[#202020] rounded-xl p-3">
                <p className="text-xl font-black text-[#00F0FF] font-mono">24/7</p>
                <p className="text-[11px] text-neutral-400 font-medium">Live On-Call</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
