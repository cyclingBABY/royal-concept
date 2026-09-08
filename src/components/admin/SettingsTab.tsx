import React, { useState } from 'react';
import { 
  Phone, 
  Clock, 
  MapPin, 
  Mail, 
  MessageSquare, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

interface SettingsTabProps {
  settings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
  onReset: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset contact info and banner text to Royal Concepts defaults?')) {
      onReset();
      setFormData(settings);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Site Settings & Direct Contacts
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Update official company phone hotlines, 24/7 emergency rigging dispatch, business hours, and website banner text.
          </p>
        </div>

        {isSavedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Official Phone Numbers (Specified in prompt: 0772 615 454, 0702 615 454, 0702 838 474) */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
              OFFICIAL CONTACT CHANNELS
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Phone Numbers & Technical Dispatch Lines
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              These phone numbers are displayed across the header, footer, contact section, and mobile click-to-call bars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Primary Phone */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#2563EB]" />
                <span>Primary Line *</span>
              </label>
              <input
                type="text"
                required
                value={formData.primaryPhone}
                onChange={e => setFormData({ ...formData, primaryPhone: e.target.value })}
                placeholder="0772 615 454"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white font-mono outline-none text-xs"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Main production desk</span>
            </div>

            {/* WhatsApp Line */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp Line *</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsappPhone}
                onChange={e => setFormData({ ...formData, whatsappPhone: e.target.value })}
                placeholder="0702 615 454"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white font-mono outline-none text-xs"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Direct chat & rider transfers</span>
            </div>

            {/* Technical / Rigging Line */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-cyan-400" />
                <span>Technical & Rigging *</span>
              </label>
              <input
                type="text"
                required
                value={formData.technicalPhone}
                onChange={e => setFormData({ ...formData, technicalPhone: e.target.value })}
                placeholder="0702 838 474"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white font-mono outline-none text-xs"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Emergency rigging & engineer</span>
            </div>
          </div>
        </div>

        {/* Card 2: Business Hours & Operational Address */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
              OPERATIONS & DEPOT
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Business Hours & Depot Logistics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#2563EB]" />
                <span>Business & Dispatch Hours</span>
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={e => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="24/7 Event Rigging & Emergency Production Support"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2563EB]" />
                <span>Depot Location</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kampala, Uganda (Deployments across East Africa)"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#2563EB]" />
                <span>Official Contact Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@royalconcepts.events"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Announcement Banner Text */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
                WEBSITE BROADCAST
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Top Announcement Banner Text
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="banner-enabled-toggle"
                checked={formData.bannerEnabled}
                onChange={e => setFormData({ ...formData, bannerEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#2563EB] cursor-pointer"
              />
              <label htmlFor="banner-enabled-toggle" className="text-xs text-neutral-300 font-bold cursor-pointer">
                Banner Active
              </label>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
              Broadcast Message Content
            </label>
            <textarea
              rows={2}
              value={formData.bannerText}
              onChange={e => setFormData({ ...formData, bannerText: e.target.value })}
              placeholder="e.g. Now Booking Q4 2026 Concerts, Corporate Summits & Galas in Kampala • 24/7 Technical Dispatch: 0772 615 454"
              className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl p-3 text-white outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Banner Live Preview */}
          {formData.bannerEnabled && (
            <div className="p-3 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-xs text-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="font-medium">{formData.bannerText}</span>
              </div>
              <span className="text-[10px] font-mono text-[#2563EB] uppercase font-bold shrink-0 ml-2">
                Live Preview
              </span>
            </div>
          )}
        </div>

        {/* Card 4: Tagline & Branding */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-4 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
              BRANDING & COPY
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Service Tagline & Headline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Services Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="For: Lights, Truss, Screens, Sound and Boardwork"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                Hero Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                placeholder="Engineering Unforgettable Stage & Event Experiences"
                className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2.5 text-white outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Homepage Hero Background Picture & Brand Visuals */}
        <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-5 shadow-xl">
          <div className="border-b border-[#2E323B] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#00F0FF] font-bold">
              VISUAL ASSETS & HERO IMAGERY
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Homepage Hero Background & Brand Pictures
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Easily change the atmospheric concert lighting picture shown across the homepage hero banner, or upload a custom company logo emblem.
            </p>
          </div>

          <div className="space-y-4">
            {/* Hero Background Image */}
            <ImageInputWithPicker
              label="Homepage Hero Background Picture"
              value={formData.heroImageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=80'}
              onChange={url => setFormData({ ...formData, heroImageUrl: url })}
              categoryContext="hero"
              aspectRatio="banner"
              helperText="The atmospheric concert stage background photo rendered behind the Royal Concepts headline on the home page."
            />

            {/* Custom Brand Logo / Emblem */}
            <div className="pt-2 border-t border-[#2E323B]">
              <ImageInputWithPicker
                label="Custom Brand Logo / Emblem (Optional)"
                value={formData.logoImageUrl || ''}
                onChange={url => setFormData({ ...formData, logoImageUrl: url })}
                categoryContext="general"
                aspectRatio="square"
                placeholder="Leave blank to use default SVG Royal Concepts crown logo..."
                helperText="Upload a transparent PNG or SVG logo file from your device if you want to replace the default vector crown logo."
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#252830] text-neutral-400 hover:text-white border border-[#2E323B] text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-[#2563EB]/25 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
