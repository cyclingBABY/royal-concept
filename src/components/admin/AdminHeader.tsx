import React from 'react';
import { 
  Bell, 
  ExternalLink, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface AdminHeaderProps {
  pendingQuotesCount: number;
  activeOnsiteCount: number;
  timeString: string;
  onNavigateHome: () => void;
  onNewProject: () => void;
  onNewBooking: () => void;
  activeTabTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  pendingQuotesCount,
  activeOnsiteCount,
  timeString,
  onNavigateHome,
  onNewProject,
  onNewBooking,
  activeTabTitle,
}) => {
  return (
    <header className="h-16 bg-[#1A1C20] border-b border-[#2E323B] px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-20">
      {/* Left: Active Section breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-white tracking-wide">
          {activeTabTitle}
        </span>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121316] border border-[#2E323B] text-[11px] font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Dispatch Active</span>
        </div>
      </div>

      {/* Right: Quick Stats, Live Clock, Notifications & Action Buttons */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Stats Pill */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#121316] border border-[#2E323B] text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[10px] uppercase">On-Site:</span>
            <span className="text-emerald-400 font-bold">{activeOnsiteCount} Active</span>
          </div>
          <span className="text-neutral-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[10px] uppercase">Pending RFQs:</span>
            <span className="text-amber-400 font-bold">{pendingQuotesCount} New</span>
          </div>
        </div>

        {/* Kampala EAT Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121316] border border-[#2E323B] text-xs font-mono text-neutral-300">
          <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>EAT (Kampala) {timeString || '00:00:00'}</span>
        </div>

        {/* View Live Site Button */}
        <button
          onClick={onNavigateHome}
          className="px-3 py-1.5 rounded-xl bg-[#121316] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] text-xs font-medium transition flex items-center gap-1.5"
          title="Return to Public Website"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Site</span>
        </button>

        {/* Quick Add Project or Log Lead */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewProject}
            className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#2563EB]/25"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};
