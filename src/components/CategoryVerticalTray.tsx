import React, { useState, useMemo } from 'react';
import { ServiceCategory } from '../types';
import { CATEGORIES_MASTER, SERVICES_MASTER } from '../data/serviceCatalogMaster';
import { CategoryIcon } from './CategoryIcon';
import {
  LayoutGrid,
  Search,
  X,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface CategoryVerticalTrayProps {
  categories: ServiceCategory[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  totalServicesCount?: number;
  className?: string;
  onOpenCategoriesPage?: () => void;
}

export const CategoryVerticalTray: React.FC<CategoryVerticalTrayProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery = '',
  onClearSearch,
  isOpenMobile = false,
  onCloseMobile,
  totalServicesCount = 978,
  className = '',
  onOpenCategoriesPage
}) => {
  const [trayFilter, setTrayFilter] = useState<string>('');

  // Map of category slug to service count from authoritative SERVICES_MASTER
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

  // Filtered categories within the tray
  const filteredCategories = useMemo(() => {
    if (!trayFilter.trim()) return categories;
    const q = trayFilter.toLowerCase().trim();
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, trayFilter]);

  const handleSelect = (slug: string) => {
    onSelectCategory(slug);
    if (onClearSearch && searchQuery) {
      onClearSearch();
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const trayContent = (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Tray Header */}
      <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                Category Tray
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                50 Odisha Trades • {totalServicesCount} Hourly Skills
              </p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer md:hidden"
              aria-label="Close tray"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* In-Tray Quick Filter */}
        <div className="relative mt-2.5">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter 50 categories..."
            value={trayFilter}
            onChange={(e) => setTrayFilter(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {trayFilter && (
            <button
              onClick={() => setTrayFilter('')}
              className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Vertical Tray List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-250px)]">
        {/* "All Categories" Item */}
        {(!trayFilter.trim() || 'all categories'.includes(trayFilter.toLowerCase())) && (
          <button
            id="tray-item-all-categories"
            onClick={() => handleSelect('all')}
            className={`w-full group flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
              selectedCategory === 'all' && !searchQuery
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50/60 hover:bg-slate-100/90 text-slate-800 border-slate-100 hover:border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  selectedCategory === 'all' && !searchQuery
                    ? 'bg-white/15 text-emerald-400'
                    : 'bg-white text-slate-700 border border-slate-200/60 group-hover:text-emerald-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">
                  All Categories
                </span>
                <span
                  className={`text-[10px] font-medium block truncate ${
                    selectedCategory === 'all' && !searchQuery
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  Full Master Catalog
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  selectedCategory === 'all' && !searchQuery
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/30'
                    : 'bg-slate-200/70 text-slate-700'
                }`}
              >
                {totalServicesCount}
              </span>
              {selectedCategory === 'all' && !searchQuery && (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
            </div>
          </button>
        )}

        {/* 50 Categories in Vertical Sequence */}
        {filteredCategories.map((cat, index) => {
          const isSelected = selectedCategory === cat.slug;
          const masterDef = CATEGORIES_MASTER.find(m => m.slug === cat.slug);
          const iconName = masterDef?.icon || cat.icon_name || 'Wrench';
          const serviceCount = countsBySlug.get(cat.slug) || cat.service_count || 12;
          const displayOrder = cat.sort_order || (index + 1);

          return (
            <button
              key={cat.slug}
              id={`tray-item-${cat.slug}`}
              onClick={() => handleSelect(cat.slug)}
              className={`w-full group flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-1 ring-emerald-700/50'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-100/90 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {/* Number & Icon */}
                <div className="relative shrink-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 border border-slate-200/60'
                    }`}
                  >
                    <CategoryIcon name={iconName} className="w-4 h-4" />
                  </div>
                  <span
                    className={`absolute -top-1 -left-1 text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-slate-900 text-emerald-400'
                        : 'bg-slate-200 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white'
                    }`}
                  >
                    {displayOrder}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate leading-tight">
                    {cat.name}
                  </span>
                  <span
                    className={`text-[10px] font-medium block truncate ${
                      isSelected ? 'text-emerald-100' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    Hourly doorstep
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80'
                  }`}
                >
                  {serviceCount}
                </span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                )}
              </div>
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="p-6 text-center text-slate-400 text-xs">
            No category matches "<span className="font-semibold text-slate-600">{trayFilter}</span>"
            <button
              onClick={() => setTrayFilter('')}
              className="block mx-auto mt-2 text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Link to 50 Categories Page */}
      {onOpenCategoriesPage && (
        <div className="p-2.5 bg-emerald-50/80 border-t border-emerald-100 shrink-0">
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onOpenCategoriesPage();
            }}
            id="tray-btn-open-categories-page"
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Open 50 Categories Page</span>
          </button>
        </div>
      )}

      {/* Tray Footer note */}
      <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium">
          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Verified Odisha Partners</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono font-semibold">
          100% Hourly
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Vertical Tray */}
      <aside className={`hidden md:block ${className}`}>
        {trayContent}
      </aside>

      {/* Mobile Drawer Slide-Over Tray */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          {/* Drawer Tray Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full max-h-screen z-10 p-3 flex flex-col animate-in slide-in-from-left duration-200">
            {trayContent}
          </div>
        </div>
      )}
    </>
  );
};
