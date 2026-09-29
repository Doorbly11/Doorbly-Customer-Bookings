import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Service, ServiceCategory, CustomerAddress } from '../types';
import { CATEGORIES_MASTER } from '../data/serviceCatalogMaster';
import { getCustomServices } from '../lib/adminStore';
import { CategoryIcon } from './CategoryIcon';
import { ServiceCard } from './ServiceCard';
import {
  Search,
  X,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  ListFilter,
  Layers,
  ArrowUpDown,
  Tag,
  Clock,
  Compass,
  Zap,
  MapPin,
  ChevronDown
} from 'lucide-react';

interface AllServicesViewProps {
  onSelectServiceToBook: (service: Service) => void;
  onAddToCart?: (service: Service) => void;
  initialCategorySlug?: string;
  onGoBack?: () => void;
  currentAddress?: CustomerAddress;
  onOpenCategoriesPage?: () => void;
}

export const AllServicesView: React.FC<AllServicesViewProps> = ({
  onSelectServiceToBook,
  onAddToCart,
  initialCategorySlug,
  onGoBack,
  currentAddress,
  onOpenCategoriesPage
}) => {
  const [services, setServices] = useState<Service[]>(() => getCustomServices());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'min-hours'>('default');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-200' | '200-350' | 'above-350'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Quick category jump bar ref
  const categoryJumpRef = useRef<HTMLDivElement>(null);

  // Sync services if updated via admin
  useEffect(() => {
    const handleUpdate = () => setServices(getCustomServices());
    window.addEventListener('doorbly_services_updated', handleUpdate);
    return () => window.removeEventListener('doorbly_services_updated', handleUpdate);
  }, []);

  // Update selectedCategory if initialCategorySlug changes
  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setVisibleCount(36);
  }, [searchQuery, selectedCategory, priceFilter, sortBy]);

  // Compute category count map based on all services
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of services) {
      const slug = s.category_slug || 'other';
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
    return counts;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    let list = services;

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter(s => s.category_slug === selectedCategory);
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.category_name && s.category_name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.slug && s.slug.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    if (priceFilter !== 'all') {
      list = list.filter(s => {
        const rate = s.customer_price ?? s.customer_hourly_price;
        if (priceFilter === 'under-200') return rate < 200;
        if (priceFilter === '200-350') return rate >= 200 && rate <= 350;
        if (priceFilter === 'above-350') return rate > 350;
        return true;
      });
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => (a.customer_price ?? a.customer_hourly_price) - (b.customer_price ?? b.customer_hourly_price));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => (b.customer_price ?? b.customer_hourly_price) - (a.customer_price ?? a.customer_hourly_price));
    } else if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'min-hours') {
      list = [...list].sort((a, b) => (a.minimum_hours || 1) - (b.minimum_hours || 1));
    }

    return list;
  }, [services, selectedCategory, searchQuery, priceFilter, sortBy]);

  // Group services by category for categorized view
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, { category: (typeof CATEGORIES_MASTER)[0]; services: Service[] }>();

    // Prepare map with active categories that have services
    for (const cat of CATEGORIES_MASTER) {
      map.set(cat.slug, { category: cat, services: [] });
    }

    for (const s of filteredServices) {
      const slug = s.category_slug || 'other';
      if (map.has(slug)) {
        map.get(slug)!.services.push(s);
      } else {
        // Fallback for custom category slug
        const fallbackCat = {
          name: s.category_name || 'Other Services',
          slug: slug,
          description: `Doorstep services under ${s.category_name || slug}`,
          icon: 'Wrench',
          sort_order: 99
        };
        map.set(slug, { category: fallbackCat, services: [s] });
      }
    }

    // Return only categories that have at least 1 matching service
    return Array.from(map.values()).filter(item => item.services.length > 0);
  }, [filteredServices]);

  // Smooth scroll to category section
  const handleScrollToCategory = (slug: string) => {
    const el = document.getElementById(`category-section-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumbs & Stats Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <button
          onClick={onGoBack}
          id="btn-goback-services-page"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{services.length} Services Listed</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200/70 hidden sm:inline-flex">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>50 Trade Categories</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200/70 hidden md:inline-flex">
            <span>Transparent Hourly Billing</span>
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-9 border border-indigo-500/20 shadow-xl shadow-slate-950/20">
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-400/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide mb-3 shadow-inner">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Complete Odisha Doorstep Directory</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2.5">
            All Services We Provide
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6 font-normal">
            Explore our authoritative catalog of verified doorstep trades across all 30 districts of Odisha. Certified background checks, transparent hourly rates from ₹99/hr, and zero hidden charges.
          </p>

          {/* Quick Search Input */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              id="input-all-services-search"
              placeholder="Search across 978+ services (e.g. Electrician, RO Service, Deep Cleaning, Carpenter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-slate-900/90 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-6 shadow-2xs space-y-4">
        {/* Row 1: Filter Selectors */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5">
          {/* Category Dropdown & Quick Selector */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            <div className="relative min-w-[200px] w-full sm:w-auto">
              <select
                id="select-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300/80 rounded-xl px-3.5 py-2 pr-9 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                <option value="all">All 50 Categories ({services.length})</option>
                {CATEGORIES_MASTER.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({categoryCounts.get(cat.slug) || 0})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
            </div>

            {/* Price Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(
                [
                  { id: 'all', label: 'All Rates' },
                  { id: 'under-200', label: '< ₹200/hr' },
                  { id: '200-350', label: '₹200 - ₹350/hr' },
                  { id: 'above-350', label: '₹350+/hr' }
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriceFilter(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    priceFilter === p.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & View Mode Switches */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="select-sort-services"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-slate-50 border border-slate-300/80 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="default">Sort: Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="min-hours">Min Hours (Lowest)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Categorized View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Categorized</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="All Services Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Horizontal Quick Jump Pills (When grouped mode is active) */}
        {viewMode === 'grouped' && groupedByCategory.length > 1 && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Jump to Category:
              </span>
            </div>
            <div
              ref={categoryJumpRef}
              className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200"
            >
              {groupedByCategory.map((group) => (
                <button
                  key={group.category.slug}
                  onClick={() => handleScrollToCategory(group.category.slug)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <CategoryIcon name={group.category.icon} className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{group.category.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold bg-white px-1.5 py-0.2 rounded-md border border-slate-200">
                    {group.services.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredServices.length}</span> of {services.length} services
          {selectedCategory !== 'all' && (
            <span> in <span className="font-bold text-emerald-700">{CATEGORIES_MASTER.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span></span>
          )}
          {searchQuery && (
            <span> matching "<span className="font-bold text-slate-900">{searchQuery}</span>"</span>
          )}
        </p>

        {(selectedCategory !== 'all' || searchQuery || priceFilter !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setPriceFilter('all');
              setSortBy('default');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No services found</h3>
          <p className="text-xs text-slate-500 mb-5">
            We couldn't find any services matching your search or filters. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPriceFilter('all');
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        /* Categorized Group View */
        <div className="space-y-12">
          {groupedByCategory.map((group) => (
            <section
              key={group.category.slug}
              id={`category-section-${group.category.slug}`}
              className="scroll-mt-24"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/70 shrink-0">
                    <CategoryIcon name={group.category.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {group.category.name}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {group.category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {group.services.length} {group.services.length === 1 ? 'Service' : 'Services'}
                  </span>
                </div>
              </div>

              {/* Category Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4.5">
                {group.services.map((service) => (
                  <ServiceCard
                    key={service.id || service.slug}
                    service={service}
                    onBook={onSelectServiceToBook}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4.5">
            {filteredServices.slice(0, visibleCount).map((service) => (
              <ServiceCard
                key={service.id || service.slug}
                service={service}
                onBook={onSelectServiceToBook}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Pagination / Load More */}
          {filteredServices.length > visibleCount && (
            <div className="pt-4 pb-6 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 36)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 hover:border-emerald-500"
              >
                <span>
                  Load More Services ({filteredServices.length - visibleCount} remaining)
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
