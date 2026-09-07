import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Tv, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Phone, 
  Eye, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  ExternalLink 
} from 'lucide-react';
import { AdminInquiry, ServiceCategory, PortfolioProjectAdmin, EquipmentItemAdmin } from '../../types';

interface DashboardTabProps {
  inquiries: AdminInquiry[];
  projects: PortfolioProjectAdmin[];
  equipment: EquipmentItemAdmin[];
  onSelectInquiry: (inquiry: AdminInquiry) => void;
  onNewBooking: () => void;
  onNewProject: () => void;
  onNavigateToInquiries: () => void;
  onNavigateToProjects: () => void;
  onNavigateToEquipment: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  inquiries,
  projects,
  equipment,
  onSelectInquiry,
  onNewBooking,
  onNewProject,
  onNavigateToInquiries,
  onNavigateToProjects,
  onNavigateToEquipment,
}) => {
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Contacted'>('All');

  // Exact 4 metric cards as requested:
  // 1. Total Inquiries (e.g. 28 New / Total)
  const totalInquiriesCount = inquiries.length;
  // 2. Active Projects (e.g. 5 On-site)
  const activeProjectsCount = projects.filter(p => p.isOnSite).length;
  // 3. LED Screen Inventory (e.g. 12 Units Available)
  const ledScreenItem = equipment.find(e => e.id === 'eq-led-p39' || e.name.toLowerCase().includes('led'));
  const ledScreenUnits = ledScreenItem ? ledScreenItem.availableUnits : 12;
  // 4. Pending Quotes (e.g. 8 Pending)
  const pendingQuotesCount = inquiries.filter(i => i.status === 'Pending').length;

  // Filtered recent quote requests
  const recentInquiries = inquiries.filter(i => {
    const matchesSearch = 
      i.fullName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      i.phoneNumber.includes(tableSearch) ||
      i.venueLocation.toLowerCase().includes(tableSearch.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && i.status === statusFilter;
  });

  const getServiceBadge = (s: ServiceCategory) => {
    switch (s) {
      case 'lighting':
        return <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">Lights</span>;
      case 'trussing':
        return <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Trusses</span>;
      case 'led-screens':
        return <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">LED Screens</span>;
      case 'audio-sound':
        return <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">Sound</span>;
      case 'stage-boardwork':
        return <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">Boardwork</span>;
      default:
        return <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300">{s}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Pending
          </span>
        );
      case 'Contacted':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Contacted
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Confirmed
          </span>
        );
      case 'In Logistics':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            In Logistics
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-neutral-800 text-neutral-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Overview Greeting & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time operations metrics, warehouse gear availability, and incoming client quote requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewBooking}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#2563EB]/25"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Top Quick Stats Cards (4 Columns as requested in prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Inquiries */}
        <div 
          onClick={onNavigateToInquiries}
          className="p-5 rounded-2xl bg-[#1A1C20] border border-[#2E323B] hover:border-[#2563EB]/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="p-2 rounded-xl bg-[#121316] text-[#2563EB] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {totalInquiriesCount}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              New Leads
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1">
            <span>Click to manage client desk</span>
            <ArrowUpRight className="w-3 h-3 text-[#2563EB]" />
          </p>
        </div>

        {/* Card 2: Active Projects */}
        <div 
          onClick={onNavigateToProjects}
          className="p-5 rounded-2xl bg-[#1A1C20] border border-[#2E323B] hover:border-[#2563EB]/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-[#121316] text-emerald-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {activeProjectsCount}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              On-site
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1">
            <span>Showcase & live stage builds</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
          </p>
        </div>

        {/* Card 3: LED Screen Inventory */}
        <div 
          onClick={onNavigateToEquipment}
          className="p-5 rounded-2xl bg-[#1A1C20] border border-[#2E323B] hover:border-[#2563EB]/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              LED Screen Inventory
            </span>
            <div className="p-2 rounded-xl bg-[#121316] text-cyan-400 group-hover:scale-110 transition-transform">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {ledScreenUnits}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Units Available
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1">
            <span>P3.9 Outdoor & P2.9 Indoor</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
          </p>
        </div>

        {/* Card 4: Pending Quotes */}
        <div 
          onClick={onNavigateToInquiries}
          className="p-5 rounded-2xl bg-[#1A1C20] border border-[#2E323B] hover:border-[#2563EB]/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              Pending Quotes
            </span>
            <div className="p-2 rounded-xl bg-[#121316] text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {pendingQuotesCount}
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Pending
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1">
            <span>Requires pricing & dispatch review</span>
            <ArrowUpRight className="w-3 h-3 text-amber-400" />
          </p>
        </div>
      </div>

      {/* Recent Quote Requests (Data Table as explicitly specified in prompt) */}
      <div className="rounded-2xl bg-[#1A1C20] border border-[#2E323B] overflow-hidden shadow-xl space-y-4 p-5">
        {/* Table Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Quote Requests
            </h2>
            <p className="text-xs text-neutral-400">
              Incoming client requests from web calculator, contact forms, and direct calls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                placeholder="Search client, phone..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#121316] border border-[#2E323B] text-xs text-white placeholder-neutral-500 outline-none focus:border-[#2563EB] w-48 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-[#2E323B] text-xs font-mono">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-2.5 py-1 rounded-lg transition ${statusFilter === 'All' ? 'bg-[#2563EB] text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Pending')}
                className={`px-2.5 py-1 rounded-lg transition ${statusFilter === 'Pending' ? 'bg-[#2563EB] text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('Contacted')}
                className={`px-2.5 py-1 rounded-lg transition ${statusFilter === 'Contacted' ? 'bg-[#2563EB] text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Contacted
              </button>
            </div>
          </div>
        </div>

        {/* Data Table: Columns = Client Name, Phone, Event Date, Services Needed, Status, Actions */}
        <div className="overflow-x-auto rounded-xl border border-[#2E323B]">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121316] text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-[#2E323B]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Services Needed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E323B]">
              {recentInquiries.slice(0, 8).map(inquiry => (
                <tr 
                  key={inquiry.id}
                  className="hover:bg-[#202328] transition-colors"
                >
                  {/* Client Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">
                      {inquiry.fullName}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate max-w-[180px]">{inquiry.venueLocation}</span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-200">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#2563EB]" />
                      <span>{inquiry.phoneNumber}</span>
                    </div>
                  </td>

                  {/* Event Date */}
                  <td className="py-3.5 px-4 font-mono text-neutral-300 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>{inquiry.eventDate}</span>
                    </div>
                  </td>

                  {/* Services Needed Badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {inquiry.selectedServices.map(s => getServiceBadge(s))}
                    </div>
                  </td>

                  {/* Status (Pending / Contacted / Confirmed etc.) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(inquiry.status)}
                  </td>

                  {/* Actions (View / Edit) */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectInquiry(inquiry)}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition inline-flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View/Edit</span>
                    </button>
                  </td>
                </tr>
              ))}

              {recentInquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 text-xs font-mono">
                    No inquiries found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Link */}
        <div className="flex items-center justify-between pt-2 text-xs text-neutral-400">
          <span>Showing {Math.min(recentInquiries.length, 8)} of {inquiries.length} client leads</span>
          <button
            onClick={onNavigateToInquiries}
            className="text-[#2563EB] hover:text-blue-400 font-bold flex items-center gap-1 transition"
          >
            <span>View All Leads & Inquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
