import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Eye, 
  Trash2, 
  Filter, 
  Mail,
  DollarSign,
  Download,
  Users,
  RotateCcw
} from 'lucide-react';
import { AdminInquiry, InquiryStatus, ServiceCategory } from '../../types';

interface InquiriesTabProps {
  inquiries: AdminInquiry[];
  onSelectInquiry: (inquiry: AdminInquiry) => void;
  onNewBooking: () => void;
  onDeleteInquiry: (id: string) => void;
  onClearAllInquiries?: () => void;
}

export const InquiriesTab: React.FC<InquiriesTabProps> = ({
  inquiries,
  onSelectInquiry,
  onNewBooking,
  onDeleteInquiry,
  onClearAllInquiries,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InquiryStatus>('All');
  const [serviceFilter, setServiceFilter] = useState<'All' | ServiceCategory>('All');

  const filtered = inquiries.filter(item => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phoneNumber.includes(search) ||
      item.venueLocation.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesService = serviceFilter === 'All' || item.selectedServices.includes(serviceFilter);

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Pending</span>;
      case 'Contacted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Contacted</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Confirmed</span>;
      case 'In Logistics':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">In Logistics</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400">{status}</span>;
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date Created', 'Client Name', 'Phone', 'Email', 'Event Date', 'Venue', 'Event Type', 'Estimated Budget UGX', 'Status', 'Services'];
    const rows = filtered.map(i => [
      i.id,
      i.createdAt,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.phoneNumber}"`,
      `"${i.email || ''}"`,
      `"${i.eventDate}"`,
      `"${i.venueLocation.replace(/"/g, '""')}"`,
      `"${i.eventType}"`,
      i.estimatedBudgetUGX || 0,
      i.status,
      `"${i.selectedServices.join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `royal_concepts_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Quote Requests & Inquiries
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage incoming client leads, status tracking (Pending/Contacted), technical quotes, and direct communications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {inquiries.length > 0 && onClearAllInquiries && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all client inquiries back to zero (0)? This will wipe test leads.')) {
                  onClearAllInquiries();
                }
              }}
              className="px-3 py-2 rounded-xl bg-[#1A1C20] hover:bg-red-950/30 text-neutral-400 hover:text-red-400 border border-[#2E323B] text-xs font-medium transition flex items-center gap-1.5"
              title="Reset client inquiries to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear to 0</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#1A1C20] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] text-xs font-bold transition flex items-center gap-1.5"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewBooking}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#2563EB]/25"
          >
            <Plus className="w-4 h-4" />
            <span>+ Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B]">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads, phone, venue..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#121316] border border-[#2E323B] text-xs text-white placeholder-neutral-500 outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {(['All', 'Pending', 'Contacted', 'Confirmed', 'In Logistics', 'Completed', 'Cancelled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-[#2563EB] text-white font-bold'
                  : 'bg-[#121316] text-neutral-400 hover:text-white border border-[#2E323B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#1A1C20] border border-[#2E323B] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121316] text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-[#2E323B]">
              <tr>
                <th className="py-3 px-4">Ref ID & Client</th>
                <th className="py-3 px-4">Phone & Quick Call</th>
                <th className="py-3 px-4">Event Details & Venue</th>
                <th className="py-3 px-4">Budget / Quote</th>
                <th className="py-3 px-4">Services</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E323B]">
              {filtered.map(inquiry => (
                <tr key={inquiry.id} className="hover:bg-[#202328] transition-colors">
                  {/* Ref ID & Client */}
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono text-[#2563EB] font-bold block">
                      {inquiry.id}
                    </span>
                    <div className="font-bold text-white text-sm">
                      {inquiry.fullName}
                    </div>
                    {inquiry.email && (
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {inquiry.email}
                      </div>
                    )}
                  </td>

                  {/* Phone & Contact Shortcuts */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-white font-medium mb-1">
                      {inquiry.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${inquiry.phoneNumber.replace(/\s+/g, '')}`}
                        className="px-2 py-0.5 rounded bg-[#121316] hover:bg-[#2563EB] hover:text-white text-neutral-400 border border-[#2E323B] text-[10px] flex items-center gap-1 transition"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${inquiry.phoneNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-[#121316] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-[#2E323B] text-[10px] flex items-center gap-1 transition"
                      >
                        <MessageSquare className="w-2.5 h-2.5" />
                        <span>WA</span>
                      </a>
                    </div>
                  </td>

                  {/* Event Details */}
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#2563EB]" />
                      <span>{inquiry.eventDate || 'Date TBD'}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{inquiry.venueLocation}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      {inquiry.eventType} • {inquiry.estimatedAudience}
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    UGX {(inquiry.estimatedBudgetUGX || 0).toLocaleString()}
                  </td>

                  {/* Services */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {inquiry.selectedServices.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-[#121316] border border-[#2E323B] text-[10px] font-mono text-neutral-300">
                          {s.replace('-screens', '').replace('stage-', '')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(inquiry.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectInquiry(inquiry)}
                        className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View/Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete inquiry ${inquiry.id}?`)) {
                            onDeleteInquiry(inquiry.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-[#121316] hover:bg-red-950/40 text-neutral-500 hover:text-red-400 border border-[#2E323B] transition"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#121316] border border-[#2E323B] flex items-center justify-center mx-auto text-[#2563EB]">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">No Client Inquiries Yet (0 Real Clients)</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          No visitors have accessed or submitted quote requests yet. Once prospective clients fill out the website calculator, submit an inquiry form, or chat with the voice assistant, their full details and equipment requests will appear here.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-center gap-3">
                        <button
                          onClick={onNewBooking}
                          className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#2563EB]/25"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Log First Client Lead</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 text-xs font-mono">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
