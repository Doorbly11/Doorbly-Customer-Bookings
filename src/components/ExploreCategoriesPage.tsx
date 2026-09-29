import React, { useState, useMemo } from 'react';
import { CATEGORIES_MASTER, SERVICES_MASTER } from '../data/serviceCatalogMaster';
import { CategoryIcon } from './CategoryIcon';
import { VfxCard } from './VfxCard';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  LayoutGrid,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ExploreCategoriesPageProps {
  onSelectCategory: (categorySlug: string) => void;
  onGoBack?: () => void;
}

export const ExploreCategoriesPage: React.FC<ExploreCategoriesPageProps> = ({
  onSelectCategory,
  onGoBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate service counts from authoritative SERVICES_MASTER
  const countsBySlug = useMemo(() => {
    const map = new Map<string, number>();
    for (const cat of CATEGORIES_MASTER) {
      map.set(cat.slug, 0);
    }
    for (const svc of SERVICES_MASTER) {
      const prev = map.get(svc.category_slug) || 0;
      map.set(svc.category_slug, prev + 1);
    }
    return map;
  }, []);

  // Filter categories by user search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES_MASTER;
    const q = searchQuery.toLowerCase().trim();
    return CATEGORIES_MASTER.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <button
          onClick={onGoBack}
          id="btn-goback-categories-page"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services Catalog</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>50 Odisha Trade Categories</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200/70 hidden sm:inline-flex">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{SERVICES_MASTER.length} Hourly Skills</span>
          </span>
        </div>
      </div>

      {/* Page Hero Banner Card */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-7 sm:p-9 border border-emerald-500/25 shadow-xl shadow-slate-950/40">
        {/* Glow & Texture */}
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide mb-3.5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master Trade Directory • Odisha's 50 Verified Categories</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-400 tracking-tight mb-2.5 drop-shadow-xs">
            Explore by Service Category
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-6 font-normal">
            Browse verified doorstep trades across Odisha with certified background checks, zero hidden fees, and transparent hourly rates.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              id="input-filter-50-categories"
              placeholder="Search trade (e.g., Electrical, Plumbing, Farm, Baby Care)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-3 text-xs sm:text-sm bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 font-medium text-white shadow-lg placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Badges */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">
            {filteredCategories.length} Trade {filteredCategories.length === 1 ? 'Category' : 'Categories'}
          </span>
          {searchQuery && (
            <span className="text-xs text-slate-500 font-medium">
              matching "<strong className="text-slate-800">{searchQuery}</strong>"
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            100% Background Verified
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full font-bold border border-slate-200/60">
            <Zap className="w-3 h-3 text-amber-500" />
            No Hidden Fees
          </span>
        </div>
      </div>

      {/* 50 Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No category matches found</h3>
          <p className="text-xs text-slate-500 mb-4">
            No category found for "{searchQuery}". Try searching for electrical, carpentry, child care, or farm.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Clear Filter & View All 50
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {filteredCategories.map((cat, idx) => {
            const skillCount = countsBySlug.get(cat.slug) || 12;
            const originalIndex = CATEGORIES_MASTER.findIndex(m => m.slug === cat.slug) + 1;

            return (
              <VfxCard
                key={cat.slug}
                id={`cat-card-${cat.slug}`}
                onClick={() => onSelectCategory(cat.slug)}
                glowColor="emerald"
                className="h-full active:scale-[0.98] transition-all"
              >
                <div className="p-4 sm:p-5 h-full flex flex-col justify-between relative bg-white transition-colors duration-200">
                  <div className="relative z-10">
                    {/* Header: Number, Icon, and Skill Count */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 border border-slate-200/80 group-hover:border-emerald-200 flex items-center justify-center transition-all duration-200 shadow-2xs">
                          <CategoryIcon name={cat.icon || 'Wrench'} className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-extrabold text-slate-400 group-hover:text-emerald-600">
                          #{String(originalIndex).padStart(2, '0')}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50/90 group-hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200/70 transition-all duration-200">
                        {skillCount} Skills
                      </span>
                    </div>

                    {/* Category Title & Description */}
                    <h3 className="text-slate-900 text-sm sm:text-base font-bold card-title leading-snug mb-1 group-hover:text-emerald-700 transition-colors duration-200">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 card-text font-normal">
                      {cat.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2.5 border-t border-slate-100/90 flex items-center justify-between text-xs relative z-10">
                    <span className="text-slate-400 text-[11px] card-subtext">
                      Hourly verified
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors card-action text-xs">
                      <span>View Services</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </VfxCard>
            );
          })}
        </div>
      )}

      {/* Bottom Go Back Action */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-center">
        <button
          onClick={onGoBack}
          id="btn-goback-categories-bottom"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Go Back to Services Catalog</span>
        </button>
      </div>
    </div>
  );
};
