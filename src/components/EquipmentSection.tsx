import React, { useState } from 'react';
import { Search, Shield, ArrowUpRight, X, RotateCcw } from 'lucide-react';
import { EQUIPMENT_INVENTORY } from '../data/mockData';

interface EquipmentSectionProps {
  onSelectEquipmentForQuote: (eqName: string) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  onSelectEquipmentForQuote,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Equipment' },
    { id: 'lighting', label: 'Lights & FX' },
    { id: 'trussing', label: 'Truss & Rigging' },
    { id: 'led-screens', label: 'LED Pitch Screens' },
    { id: 'audio-sound', label: 'Concert Sound' },
    { id: 'stage-boardwork', label: 'Platforms & Boardwork' },
  ];

  // Real-time filtering based on product name or category
  const filteredItems = EQUIPMENT_INVENTORY.filter(item => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const query = searchQuery.trim().toLowerCase();
    
    if (!query) return matchesCat;

    const categoryText = item.category.toLowerCase().replace(/-/g, ' ');
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesCategory = item.category.toLowerCase().includes(query) || categoryText.includes(query);
    const matchesModel = item.model.toLowerCase().includes(query);
    const matchesDescription = item.description.toLowerCase().includes(query);
    const matchesSpecs = item.specs?.some(spec => spec.toLowerCase().includes(query));

    return matchesCat && (matchesName || matchesCategory || matchesModel || matchesDescription || matchesSpecs);
  });

  return (
    <section id="equipment" className="py-20 bg-[#0D0D0D] border-t border-[#1C1C1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs font-mono font-semibold text-[#FF2E00]">
              PRODUCTION INVENTORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tour-Grade Rental Equipment
            </h2>
            <p className="text-neutral-400 max-w-2xl text-base">
              Fully maintained, rigorously tested hardware ready for rapid deployment across Uganda and the East African region.
            </p>
          </div>

          {/* Real-time Search input field */}
          <div className="w-full md:w-80 space-y-1.5">
            <div className="relative">
              <input
                id="equipment-search-input"
                type="text"
                placeholder="Search by product name or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-[#141414] border border-[#262626] focus:border-[#FF2E00] focus:ring-1 focus:ring-[#FF2E00]/50 rounded-xl text-xs text-white placeholder-neutral-500 outline-none transition"
                aria-label="Search rental equipment by product name or category"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 p-1 rounded-md text-neutral-400 hover:text-white hover:bg-[#252525] transition"
                  aria-label="Clear search input"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Active search filter feedback */}
            <div className="flex items-center justify-between text-[11px] px-1 text-neutral-400">
              <span>
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
              </span>
              {searchQuery && (
                <span className="font-mono text-[#FF2E00] truncate max-w-[150px]">
                  Filtering: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scrollbar-none">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === tab.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#141414] hover:bg-[#1a1a1a] text-neutral-400 hover:text-white border border-[#222222]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Equipment Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#141414] border border-[#222222] rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1F1F1F] text-neutral-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-base font-bold text-white">No equipment matching &ldquo;{searchQuery}&rdquo;</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Try searching by product name (e.g., &ldquo;Beam 380W&rdquo;, &ldquo;Box Truss&rdquo;, &ldquo;P2.9 LED&rdquo;) or by category (&ldquo;Lighting&rdquo;, &ldquo;Trussing&rdquo;, &ldquo;LED Screens&rdquo;, &ldquo;Audio Sound&rdquo;).
            </p>
            <div className="pt-2 flex items-center justify-center gap-2.5">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2b2b2b] text-xs font-bold text-white border border-[#333] transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Search</span>
                </button>
              )}
              {filterCategory !== 'all' && (
                <button
                  onClick={() => setFilterCategory('all')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FF2E00] hover:bg-[#e02900] text-xs font-bold text-white transition"
                >
                  Show All Categories
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map(item => (
              <div
                key={item.id}
                id={`gear-card-${item.id}`}
                className="bg-[#121212] hover:bg-[#161616] border border-[#1E1E1E] hover:border-[#333333] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-md group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF2E00] px-2 py-0.5 rounded bg-[#FF2E00]/10 border border-[#FF2E00]/20">
                      {item.category.replace('-', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {item.availableUnits}+ Units In-Depot
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#FF2E00] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    Model: {item.model}
                  </p>

                  <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Hardware Specs Pills */}
                  <div className="mt-4 pt-3 border-t border-[#1C1C1C] space-y-1.5 text-[11px] text-neutral-300">
                    {item.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    Rigging Ready
                  </span>
                  <button
                    onClick={() => onSelectEquipmentForQuote(item.name)}
                    className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#FF2E00] text-neutral-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>Add to Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safety & Certification Promise */}
        <div className="mt-12 p-6 rounded-2xl bg-[#141414] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-[#FF2E00]/10 border border-[#FF2E00]/30 text-[#FF2E00] shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Structural Rigging Safety & Load Calculations
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Every truss grid and line array suspension is mathematically calculated for wind loads, dynamic stress, and point loading by qualified rigging crew.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:0772615454"
              className="px-5 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-xs font-mono font-bold text-white transition flex items-center gap-2"
            >
              <span>Call Depot: 0772 615 454</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
