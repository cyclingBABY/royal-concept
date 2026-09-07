import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { PortfolioProjectAdmin, PortfolioCategory } from '../../types';

interface ProjectsTabProps {
  projects: PortfolioProjectAdmin[];
  onOpenAddModal: () => void;
  onEditProject: (project: PortfolioProjectAdmin) => void;
  onDeleteProject: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  onOpenAddModal,
  onEditProject,
  onDeleteProject,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  const filtered = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || (p.status || 'Published') === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portfolio & Projects CMS
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage stage showcases, client productions, gear manifests, and live deployment statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#2563EB]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects, venues, clients..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#121316] border border-[#2E323B] text-xs text-white placeholder-neutral-500 outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Category Pills & Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-[#2E323B] text-xs">
            {['All', 'Concerts', 'Corporate Events', 'Stage Builds', 'Exhibitions'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-[#2E323B] text-xs">
            {(['All', 'Published', 'Draft'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  statusFilter === st
                    ? 'bg-[#2E323B] text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(project => {
          const isPublished = (project.status || 'Published') === 'Published';
          return (
            <div
              key={project.id}
              className="rounded-2xl bg-[#1A1C20] border border-[#2E323B] overflow-hidden hover:border-[#2563EB]/60 transition flex flex-col group shadow-lg"
            >
              {/* Image Banner */}
              <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C20] via-transparent to-black/50" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#121316]/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
                    {project.category}
                  </span>
                  {project.isOnSite && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/90 text-white shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Active On-site
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-xs text-neutral-300 flex items-center justify-between font-mono text-[11px]">
                  <span>{project.client}</span>
                  <span>{project.date}</span>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base group-hover:text-[#2563EB] transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{project.venue}</span>
                  </div>

                  {project.description && (
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Equipment Badges */}
                  <div className="pt-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-1">
                      Equipment Deployed ({project.equipmentUsed.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.equipmentUsed.slice(0, 3).map((eq, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-[#121316] border border-[#2E323B] text-[10px] font-mono text-neutral-300"
                        >
                          {eq}
                        </span>
                      ))}
                      {project.equipmentUsed.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#121316] border border-[#2E323B] text-[10px] font-mono text-neutral-500">
                          +{project.equipmentUsed.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-[#2E323B] flex items-center justify-between text-xs">
                  <button
                    onClick={() => onToggleStatus(project.id)}
                    className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-[11px] font-mono"
                    title="Toggle Published / Draft"
                  >
                    {isPublished ? (
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-neutral-500" />
                    )}
                    <span>{isPublished ? 'Live on Site' : 'Hidden (Draft)'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditProject(project)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#121316] hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-[#2E323B] transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-500 font-mono text-xs bg-[#1A1C20] rounded-2xl border border-[#2E323B] p-6 space-y-3">
            <p>No portfolio projects found matching filters.</p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold transition"
            >
              Add First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
