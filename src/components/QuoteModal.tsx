import React, { useState } from 'react';
import { X, Phone, MessageSquare, Send, CheckCircle2, Calendar, MapPin, Users, HelpCircle, Volume2 } from 'lucide-react';
import { ServiceCategory } from '../types';
import { COMPANY_CONTACT } from '../data/mockData';
import { addInquiry } from '../data/adminStore';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceCategory | null;
  onOpenAudioBot?: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialService = null,
  onOpenAudioBot,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [eventType, setEventType] = useState('Concert / Festival');
  const [estimatedAudience, setEstimatedAudience] = useState('1,000 - 3,000');
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>(
    initialService ? [initialService] : ['lighting', 'trussing', 'led-screens']
  );
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submittedState, setSubmittedState] = useState(false);

  if (!isOpen) return null;

  const toggleService = (service: ServiceCategory) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const servicesList: { id: ServiceCategory; label: string; details: string }[] = [
    { id: 'lighting', label: 'Lighting Systems', details: 'DMX, Moving Heads, Beams, Washes & Atmospheric FX' },
    { id: 'trussing', label: 'Trussing & Rigging', details: 'Heavy-duty Aluminum Box Trusses, Roof Grid, Motors' },
    { id: 'led-screens', label: 'LED Display Screens', details: 'P2.9 / P3.9 High-Res Indoor & Outdoor Video Walls' },
    { id: 'audio-sound', label: 'Pro Sound Reinforcement', details: 'Concert Line Array, Digital Consoles, Wireless Mics' },
    { id: 'stage-boardwork', label: 'Stage & Boardwork', details: 'Heavy Risers, CNC Custom Sets, Branded Backdrops' },
  ];

  const buildQuoteSummaryText = () => {
    const servicesText = selectedServices
      .map(s => {
        const item = servicesList.find(x => x.id === s);
        return `• ${item?.label || s}`;
      })
      .join('\n');

    return (
      `*ROYAL CONCEPTS EVENT QUOTE REQUEST*\n\n` +
      `*Client:* ${fullName || 'Not provided'}\n` +
      `*Phone:* ${phoneNumber || 'Not provided'}\n` +
      `*Email:* ${email || 'Not provided'}\n` +
      `*Event Type:* ${eventType}\n` +
      `*Date:* ${eventDate || 'TBD'}\n` +
      `*Venue / City:* ${venueLocation || 'Kampala'}\n` +
      `*Audience Size:* ${estimatedAudience}\n\n` +
      `*Requested Production Services:*\n${servicesText || 'General Inquiry'}\n\n` +
      `*Notes:* ${additionalNotes || 'Please send available equipment quotation.'}`
    );
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      fullName: fullName || 'Direct WhatsApp Inquirer',
      phoneNumber: phoneNumber || 'Provided via WhatsApp',
      email: email || undefined,
      eventDate: eventDate || 'Date TBD',
      venueLocation: venueLocation || 'Kampala / Uganda',
      eventType,
      estimatedAudience,
      selectedServices,
      estimatedBudgetUGX: 15000000,
      notes: additionalNotes,
      source: 'Quote Modal',
    });
    const summary = buildQuoteSummaryText();
    const cleanPhone = COMPANY_CONTACT.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmittedState(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      fullName: fullName || 'Email Inquirer',
      phoneNumber: phoneNumber || 'Pending call back',
      email: email || undefined,
      eventDate: eventDate || 'Date TBD',
      venueLocation: venueLocation || 'Kampala / Uganda',
      eventType,
      estimatedAudience,
      selectedServices,
      estimatedBudgetUGX: 15000000,
      notes: additionalNotes,
      source: 'Quote Modal',
    });
    const summary = buildQuoteSummaryText();
    const subject = `Event Quote Request: ${eventType} - ${fullName || 'New Client'}`;
    const mailtoUrl = `mailto:${COMPANY_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
    window.location.href = mailtoUrl;
    setSubmittedState(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in no-scrollbar scrollbar-none">
      <div 
        id="quote-calculator-modal"
        className="relative w-full max-w-2xl my-8 bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FF2E00] animate-pulse" />
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">Event Quote & Gear Request</h3>
              <p className="text-xs text-neutral-400">Direct transmission to Royal Concepts production desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#202020] hover:bg-[#2c2c2c] text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Phone Banner */}
        <div className="bg-[#1a1412] border-b border-[#331c16] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-[#FF2E00]" />
            Need immediate gear reservation? Call direct:
          </span>
          <div className="flex items-center gap-2 font-mono font-bold text-[#FF2E00]">
            <a href="tel:0772615454" className="hover:underline">0772 615 454</a>
            <span className="text-neutral-600">•</span>
            <a href="tel:0702615454" className="hover:underline">0702 615 454</a>
            <span className="text-neutral-600">•</span>
            <a href="tel:0702838474" className="hover:underline">0702 838 474</a>
          </div>
        </div>

        {submittedState ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#FF2E00]/10 border border-[#FF2E00]/30 text-[#FF2E00] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-white">Request Dispatched!</h4>
            <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Your stage production requirements have been forwarded to our rigging & technical leads. Our production manager will contact you within 15–30 minutes with equipment availability and pricing.
            </p>
            <div className="p-4 bg-[#181818] border border-[#262626] rounded-xl text-xs font-mono text-neutral-400 max-w-md mx-auto text-left">
              <p className="text-white font-bold mb-1">Direct Lines for Urgent Dispatch:</p>
              <p>• Lead Coordinator: 0772 615 454</p>
              <p>• WhatsApp & Rigging Desk: 0702 615 454 (WhatsApp Active)</p>
              <p>• Sound & LED Engineer: 0702 838 474</p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onOpenAudioBot && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAudioBot();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#FF2E00]/60 hover:border-[#FF2E00] text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-[#FF2E00]/20 transition hover:scale-[1.02]"
                >
                  <Volume2 className="w-4 h-4 text-[#FF2E00]" />
                  <span>Talk with Audio Bot while waiting</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSubmittedState(false)}
                className="px-5 py-2.5 rounded-xl bg-[#222] hover:bg-[#2d2d2d] text-sm font-semibold text-neutral-200 transition"
              >
                Submit Another Request
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#FF2E00] hover:bg-[#e02900] text-sm font-bold text-white transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendWhatsApp} className="p-6 space-y-5">
            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Mukasa"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] focus:ring-1 focus:ring-[#FF2E00] rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Phone Number (Call / WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0772 ... or +256 7..."
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] focus:ring-1 focus:ring-[#FF2E00] rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Event Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] focus:ring-1 focus:ring-[#FF2E00] rounded-xl text-sm text-white outline-none transition"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Venue / Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lugogo Oval, Serena, Munyonyo..."
                    value={venueLocation}
                    onChange={e => setVenueLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] focus:ring-1 focus:ring-[#FF2E00] rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition"
                  />
                  <MapPin className="absolute right-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Event Scope Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Event Format
                </label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] rounded-xl text-sm text-white outline-none"
                >
                  <option value="Concert / Music Festival">Concert / Music Festival</option>
                  <option value="Corporate Gala / Summit">Corporate Gala / Summit</option>
                  <option value="Church Crusade / Mega Service">Church Crusade / Mega Service</option>
                  <option value="Wedding / High-End Reception">Wedding / High-End Reception</option>
                  <option value="Trade Expo / Exhibition">Trade Expo / Exhibition</option>
                  <option value="Product Launch / Press Stage">Product Launch / Press Stage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Estimated Audience
                </label>
                <select
                  value={estimatedAudience}
                  onChange={e => setEstimatedAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] rounded-xl text-sm text-white outline-none"
                >
                  <option value="Under 500 Guests">Under 500 Guests (Intimate / Plenary)</option>
                  <option value="500 - 1,500 Guests">500 - 1,500 Guests (Ballroom / Hall)</option>
                  <option value="1,500 - 5,000 Attendees">1,500 - 5,000 Attendees (Arena / Grounds)</option>
                  <option value="5,000 - 20,000+ Attendees">5,000 - 20,000+ Attendees (Stadium / Mega Field)</option>
                </select>
              </div>
            </div>

            {/* Service Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Select Required Services & Equipment:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {servicesList.map(item => {
                  const isChecked = selectedServices.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleService(item.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isChecked
                          ? 'bg-[#FF2E00]/10 border-[#FF2E00] text-white'
                          : 'bg-[#181818] border-[#292929] text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-[#FF2E00] border-[#FF2E00] text-white' : 'border-neutral-600 bg-[#222]'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-neutral-400 leading-tight">
                          {item.details}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message / Rider upload notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Technical Specifications or Message
              </label>
              <textarea
                rows={2}
                placeholder="Specify dimensions (e.g. 10x4m LED, 12m roof truss, riser heights) or special requirements..."
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-[#FF2E00] rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Send via WhatsApp (+256 702 615 454)</span>
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF2E00]/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send via Email</span>
              </button>
            </div>
            <p className="text-[11px] text-center text-neutral-500">
              Instant quote estimates calculated according to production scale, technician crew & rigging hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
