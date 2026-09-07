import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Layers, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getPortfolioProjects } from '../data/adminStore';
import { PortfolioCategory, PortfolioProjectAdmin } from '../types';

interface PortfolioSectionProps {
  onOpenQuoteWithDetails?: (projectName: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onOpenQuoteWithDetails,
}) => {
  const [projects, setProjects] = useState<PortfolioProjectAdmin[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('All');
  const [activeProject, setActiveProject] = useState<PortfolioProjectAdmin | null>(null);

  const loadProjects = () => {
    const all = getPortfolioProjects();
    // Only display published projects on public client page
    setProjects(all.filter(p => p.status !== 'Draft'));
  };

  useEffect(() => {
    loadProjects();
    const handleUpdate = () => loadProjects();
    window.addEventListener('royal_concepts_admin_event', handleUpdate);
    return () => window.removeEventListener('royal_concepts_admin_event', handleUpdate);
  }, []);

  const categories: PortfolioCategory[] = [
    'All',
    'Concerts',
    'Corporate Events',
    'Stage Builds',
    'Exhibitions',
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 bg-[#0A0A0A] border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs font-mono font-semibold text-[#00F0FF]">
              VERIFIED TRACK RECORD
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Stage & Event Portfolio
            </h2>
            <p className="text-neutral-400 max-w-2xl text-base">
              Explore stadium concerts, international summits, multi-tier choir arenas, and commercial brand exhibitions powered by Royal Concepts.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400">
            Showing {filteredProjects.length} of {projects.length} Major Productions
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF2E00] text-white shadow-lg shadow-[#FF2E00]/25'
                    : 'bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 border border-[#222222]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              id={`portfolio-card-${project.id}`}
              onClick={() => setActiveProject(project)}
              className="group cursor-pointer bg-[#121212] hover:bg-[#161616] border border-[#1F1F1F] hover:border-[#333333] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Project Image */}
              <div className="relative h-52 w-full overflow-hidden bg-black">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[#FF2E00] border border-[#333]">
                    {project.category}
                  </span>
                </div>

                {/* Attendance badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-neutral-300 flex items-center gap-1">
                    <Users className="w-3 h-3 text-neutral-400" />
                    {project.attendance}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 text-[11px] text-neutral-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FF2E00] shrink-0" />
                  <span className="truncate">{project.venue}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF2E00] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Equipment Badge Tags */}
                <div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.equipmentUsed.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1c1c1c] text-neutral-300 border border-[#2b2b2b]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Details Prompt */}
                <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition">
                  <span className="font-mono text-[11px]">{project.date}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#FF2E00]">
                    Inspect Rig Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#121212] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
            {/* Modal Image banner */}
            <div className="relative h-64 w-full">
              <img
                src={activeProject.imageUrl}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/30" />
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-sm transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-mono font-bold text-[#FF2E00] uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 border border-[#333]">
                  {activeProject.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  {activeProject.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-[#181818] rounded-xl border border-[#262626] text-xs">
                <div>
                  <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">Client / Organizers</span>
                  <span className="font-bold text-white">{activeProject.client}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">Venue Location</span>
                  <span className="font-bold text-white truncate block">{activeProject.venue}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">Turnout Scale</span>
                  <span className="font-bold text-[#00F0FF]">{activeProject.attendance}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Production Engineering Summary
                </h4>
                <p className="text-sm text-neutral-200 leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              {/* Equipment Used Badges */}
              <div>
                <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF2E00]" />
                  Deployed Equipment Roster
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.equipmentUsed.map((eq, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-[#1F1F1F] border border-[#2F2F2F] text-xs font-mono text-white"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operational highlight */}
              <div className="p-3.5 rounded-xl bg-[#FF2E00]/10 border border-[#FF2E00]/30 text-xs text-neutral-300">
                <span className="font-bold text-[#FF2E00] uppercase tracking-wider block mb-1">
                  Key Technical Achievement:
                </span>
                {activeProject.highlight}
              </div>

              {/* Modal footer actions */}
              <div className="pt-3 border-t border-[#222222] flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] text-xs font-bold text-neutral-300 transition"
                >
                  Back to Portfolio
                </button>
                <button
                  onClick={() => {
                    const title = activeProject.title;
                    setActiveProject(null);
                    if (onOpenQuoteWithDetails) {
                      onOpenQuoteWithDetails(title);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E00] hover:bg-[#d92700] text-xs font-extrabold text-white uppercase tracking-wider transition"
                >
                  Request Similar Stage Build
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
