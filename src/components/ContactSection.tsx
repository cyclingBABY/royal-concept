import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Users,
  ShieldCheck,
  Copy,
  Check,
  Volume2
} from 'lucide-react';
import { COMPANY_CONTACT } from '../data/mockData';
import { ServiceCategory } from '../types';
import { addInquiry } from '../data/adminStore';

interface ContactSectionProps {
  onOpenAudioBot?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenAudioBot }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    'lighting',
    'trussing',
    'led-screens',
    'audio-sound',
  ]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const toggleService = (id: ServiceCategory) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const buildWhatsAppText = () => {
    const services = selectedServices.map(s => {
      switch (s) {
        case 'lighting': return 'Lighting (Moving Heads, DMX, FX)';
        case 'trussing': return 'Trussing & Rigging';
        case 'led-screens': return 'LED Display Screens';
        case 'audio-sound': return 'Pro Concert Sound';
        case 'stage-boardwork': return 'Stage Platforms & Boardwork';
        default: return s;
      }
    }).join(', ');

    return (
      `*ROYAL CONCEPTS INQUIRY*\n` +
      `*Name:* ${fullName || 'Client'}\n` +
      `*Phone:* ${phoneNumber || 'Not provided'}\n` +
      `*Event Date:* ${eventDate || 'TBD'}\n` +
      `*Venue:* ${venueLocation || 'Kampala'}\n` +
      `*Services:* ${services || 'All Services'}\n` +
      `*Message:* ${message || 'Please send price quotation and availability.'}`
    );
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      fullName: fullName || 'Contact Form Lead',
      phoneNumber: phoneNumber || 'Provided via WhatsApp',
      eventDate: eventDate || 'Date TBD',
      venueLocation: venueLocation || 'Kampala / Uganda',
      eventType: 'Staging & AV Production',
      estimatedAudience: '500 - 2,000',
      selectedServices: selectedServices.length > 0 ? selectedServices : ['lighting', 'trussing'],
      estimatedBudgetUGX: 18000000,
      notes: message,
      source: 'Contact Form',
    });
    const text = buildWhatsAppText();
    const cleanNumber = COMPANY_CONTACT.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      fullName: fullName || 'Contact Form Lead',
      phoneNumber: phoneNumber || 'Pending call back',
      eventDate: eventDate || 'Date TBD',
      venueLocation: venueLocation || 'Kampala / Uganda',
      eventType: 'Staging & AV Production',
      estimatedAudience: '500 - 2,000',
      selectedServices: selectedServices.length > 0 ? selectedServices : ['lighting', 'trussing'],
      estimatedBudgetUGX: 18000000,
      notes: message,
      source: 'Contact Form',
    });
    const text = buildWhatsAppText();
    const subject = `Event Equipment Quote: ${fullName || 'Production Inquiry'}`;
    const url = `mailto:${COMPANY_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = url;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-[#0A0A0A] border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181818] border border-[#2B2B2B] text-xs font-mono font-bold text-[#FF2E00]">
            INSTANT GEAR RESERVATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get an Event Production Quote
          </h2>
          <p className="text-neutral-400 text-base">
            Configure your technical stage specifications below for immediate calculation and direct transmission to our production manager.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Phone & Company Hub */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Phone Numbers Card */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FF2E00]/15 border border-[#FF2E00]/30 text-[#FF2E00]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Direct Production Hotlines</h3>
                  <p className="text-xs text-neutral-400">Reach our technical directors immediately</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1 font-mono text-sm">
                {COMPANY_CONTACT.phones.map(phone => (
                  <div
                    key={phone.number}
                    className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-between hover:border-[#333] transition"
                  >
                    <div>
                      <a
                        href={`tel:${phone.number.replace(/\s+/g, '')}`}
                        className="font-bold text-white hover:text-[#FF2E00] transition flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#FF2E00]" />
                        {phone.number}
                      </a>
                      <span className="text-[11px] font-sans text-neutral-400 block mt-0.5">
                        {phone.label}
                      </span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(phone.number)}
                      className="p-1.5 rounded-lg bg-[#222] hover:bg-[#2c2c2c] text-neutral-400 hover:text-white transition"
                      title="Copy number"
                      aria-label="Copy phone number"
                    >
                      {copiedNumber === phone.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Direct WhatsApp Callout */}
              <a
                href={`https://wa.me/256702615454?text=${encodeURIComponent('Hello Royal Concepts, I would like to book stage equipment.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.01]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat Directly on WhatsApp (0702 615 454)</span>
              </a>
            </div>

            {/* Depot & Workshop Info */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Depot & Operations Base</h4>
                  <p className="text-neutral-400 mt-0.5">
                    Central Rigging Depot, Industrial Area, Kampala, Uganda.
                  </p>
                  <p className="text-neutral-500 mt-1">
                    Regional logistics fleet servicing Uganda, Kenya, Rwanda, and South Sudan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#1F1F1F]">
                <Clock className="w-4 h-4 text-[#FF2E00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Response & Operating Hours</h4>
                  <p className="text-neutral-400 mt-0.5">
                    Office: Mon - Sat (8:00 AM - 7:00 PM)
                  </p>
                  <p className="text-[#FF2E00] font-semibold mt-0.5">
                    24/7 Rigging Crew On-Call for Live Overnight Events
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Event Request Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] shadow-2xl">
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Event Request & Technical Rider Form
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Fill in your parameters for an itemized equipment quote and engineer deployment plan.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-[#161616] rounded-xl border border-[#2a2a2a]">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Quote Request Transmitted!</h4>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                    Thank you! Our technical directors will review your stage requirements and connect with you shortly on <span className="font-mono text-white">{phoneNumber || 'your phone'}</span>.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {onOpenAudioBot && (
                      <button
                        type="button"
                        onClick={onOpenAudioBot}
                        className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#FF2E00]/60 hover:border-[#FF2E00] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF2E00]/15 transition hover:scale-[1.02]"
                      >
                        <Volume2 className="w-4 h-4 text-[#FF2E00]" />
                        <span>Talk with Voice Assistant while waiting</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2.5 rounded-xl bg-[#222] hover:bg-[#2b2b2b] text-xs font-semibold text-neutral-300 transition"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Client / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Namubiru"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2B2B2B] focus:border-[#FF2E00] rounded-xl text-xs text-white placeholder-neutral-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Phone Number (WhatsApp Ready) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0772 ... or +256 7..."
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2B2B2B] focus:border-[#FF2E00] rounded-xl text-xs text-white placeholder-neutral-500 outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Date & Venue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Target Event Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={eventDate}
                          onChange={e => setEventDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2B2B2B] focus:border-[#FF2E00] rounded-xl text-xs text-white outline-none transition"
                        />
                        <Calendar className="absolute right-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Venue & City Location *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Serena Hotel, Lugogo Oval, Kololo"
                        value={venueLocation}
                        onChange={e => setVenueLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2B2B2B] focus:border-[#FF2E00] rounded-xl text-xs text-white placeholder-neutral-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Service Checkboxes as requested */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Required Services:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'lighting', label: 'Lighting' },
                        { id: 'trussing', label: 'Truss / Rigging' },
                        { id: 'led-screens', label: 'LED Screens' },
                        { id: 'audio-sound', label: 'Pro Sound' },
                        { id: 'stage-boardwork', label: 'Stage / Boardwork' },
                      ].map(item => {
                        const isChecked = selectedServices.includes(item.id as ServiceCategory);
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleService(item.id as ServiceCategory)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                              isChecked
                                ? 'bg-[#FF2E00]/15 border-[#FF2E00] text-white font-bold'
                                : 'bg-[#181818] border-[#292929] text-neutral-400 hover:border-neutral-500'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-[#FF2E00] border-[#FF2E00] text-white' : 'border-neutral-600'
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message box */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Message / Special Technical Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Include details such as estimated audience size, stage dimensions, indoor/outdoor setup, or specific rider items..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2B2B2B] focus:border-[#FF2E00] rounded-xl text-xs text-white placeholder-neutral-500 outline-none transition"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Submit Quote via WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEmailSubmit}
                      className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF2E00]/20 transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>Email Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
