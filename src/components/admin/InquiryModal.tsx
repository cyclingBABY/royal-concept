import React, { useState } from 'react';
import { X, Phone, MessageSquare, Mail, Calendar, MapPin, DollarSign, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { AdminInquiry, InquiryStatus, ServiceCategory } from '../../types';

interface InquiryModalProps {
  inquiry: AdminInquiry | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: InquiryStatus, internalNotes?: string) => void;
  onDelete: (id: string) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  inquiry,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!inquiry) return null;

  const [currentStatus, setCurrentStatus] = useState<InquiryStatus>(inquiry.status);
  const [internalNotes, setInternalNotes] = useState(inquiry.internalAdminNotes || '');

  const handleSave = () => {
    onUpdateStatus(inquiry.id, currentStatus, internalNotes);
    onClose();
  };

  const getServiceBadge = (s: ServiceCategory) => {
    const labels: Record<ServiceCategory, { name: string; bg: string; text: string }> = {
      lighting: { name: 'Lighting', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
      trussing: { name: 'Trusses', bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400' },
      'led-screens': { name: 'LED Screens', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
      'audio-sound': { name: 'Sound', bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400' },
      'stage-boardwork': { name: 'Boardwork', bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400' },
    };
    const item = labels[s] || { name: s, bg: 'bg-neutral-800 border-neutral-700', text: 'text-neutral-300' };
    return (
      <span key={s} className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${item.bg} ${item.text}`}>
        {item.name}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto no-scrollbar scrollbar-none">
      <div 
        id="inquiry-details-modal"
        className="relative w-full max-w-xl bg-[#1A1C20] border border-[#2E323B] rounded-2xl shadow-2xl p-6 sm:p-7 text-neutral-100 my-8 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2E323B] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#2563EB]">
                {inquiry.id}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                Source: {inquiry.source}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {inquiry.fullName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Contact Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#121316] border border-[#2E323B]">
          <a
            href={`tel:${inquiry.phoneNumber.replace(/\s+/g, '')}`}
            className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {inquiry.phoneNumber}</span>
          </a>

          <a
            href={`https://wa.me/${inquiry.phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inquiry.fullName)},%20this%20is%20Royal%20Concepts%20regarding%20your%20stage%20and%20production%20inquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Client</span>
          </a>

          {inquiry.email && (
            <a
              href={`mailto:${inquiry.email}?subject=Royal%20Concepts%20Quote%20Inquiry%20${inquiry.id}`}
              className="px-3 py-1.5 rounded-lg bg-[#262930] hover:bg-[#323640] text-neutral-200 text-xs font-medium border border-[#3A3F4B] transition flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          )}
        </div>

        {/* Key Event Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#121316] border border-[#2E323B] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Event Date</span>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{inquiry.eventDate || 'Date TBD'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121316] border border-[#2E323B] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Venue Location</span>
            <div className="flex items-center gap-1.5 text-white font-semibold truncate">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="truncate">{inquiry.venueLocation}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121316] border border-[#2E323B] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Event Type & Scale</span>
            <div className="text-white font-semibold">
              {inquiry.eventType} • <span className="text-neutral-400">{inquiry.estimatedAudience}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121316] border border-[#2E323B] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Quoted / Budget</span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
              <DollarSign className="w-3.5 h-3.5" />
              <span>UGX {(inquiry.estimatedBudgetUGX || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Services Needed Badges */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
            Services Requested
          </label>
          <div className="flex flex-wrap gap-1.5">
            {inquiry.selectedServices.map(s => getServiceBadge(s))}
          </div>
        </div>

        {/* Client's Request Notes */}
        {inquiry.notes && (
          <div className="space-y-1">
            <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
              Client Technical Rider / Notes
            </label>
            <div className="p-3 rounded-xl bg-[#121316] border border-[#2E323B] text-xs text-neutral-200 leading-relaxed">
              {inquiry.notes}
            </div>
          </div>
        )}

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
            Lead Status (Pending / Contacted / Confirmed / In Logistics / Completed / Cancelled)
          </label>
          <select
            value={currentStatus}
            onChange={e => setCurrentStatus(e.target.value as InquiryStatus)}
            className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="Pending">Pending Review</option>
            <option value="Contacted">Contacted / Follow Up</option>
            <option value="Confirmed">Confirmed Contract</option>
            <option value="In Logistics">In Logistics & Rigging Prep</option>
            <option value="Completed">Completed Event</option>
            <option value="Cancelled">Cancelled / Lost Lead</option>
          </select>
        </div>

        {/* Internal Dispatch Notes */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
            Internal Back-office & Rigging Notes
          </label>
          <textarea
            rows={3}
            value={internalNotes}
            onChange={e => setInternalNotes(e.target.value)}
            placeholder="Record client agreements, generator requirements, deposit status, rigging team assigned..."
            className="w-full bg-[#121316] border border-[#2E323B] focus:border-[#2563EB] rounded-xl p-3 text-xs text-white placeholder-neutral-600 outline-none"
          />
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2E323B]">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete inquiry ${inquiry.id}?`)) {
                onDelete(inquiry.id);
                onClose();
              }
            }}
            className="px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#252830] text-neutral-300 border border-[#2E323B] text-xs font-bold transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-[#2563EB]/25 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Update Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
