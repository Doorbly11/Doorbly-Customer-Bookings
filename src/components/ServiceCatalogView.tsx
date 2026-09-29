import React, { useEffect, useState, useTransition, useRef } from 'react';
import { CustomerAddress, CustomerProfile, Service, ServiceCategory, BannerSlide } from '../types';
import { fetchCategories, fetchServices } from '../lib/supabase';
import { getBannerSlides } from '../lib/adminStore';
import { getTechnicianVisual } from '../data/technicianVisuals';
import { CATEGORIES_MASTER, SERVICES_MASTER } from '../data/serviceCatalogMaster';
import { CategoryIcon } from './CategoryIcon';
import { ServiceCard } from './ServiceCard';
import { VfxCard, GlowColor } from './VfxCard';
import { Search, MapPin, Sparkles, Filter, X, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Navigation, SlidersHorizontal, LayoutGrid, Star, Award, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceCatalogViewProps {
  currentAddress: CustomerAddress;
  onOpenLocationModal: () => void;
  onAutoDetectLocation?: () => void;
  isLocating?: boolean;
  onSelectServiceToBook: (service: Service) => void;
  onAddToCart?: (service: Service) => void;
  initialCategorySlug?: string;
  onOpenCategoriesPage?: () => void;
  onOpenServicesPage?: () => void;
  customerProfile?: CustomerProfile;
  onOpenProfile?: () => void;
  onSelectBookings?: () => void;
  onOpenCart?: () => void;
  onOpenWallet?: () => void;
  onOpenSubscription?: () => void;
  cartCount?: number;
  activeBookingsCount?: number;
}

export const ServiceCatalogView: React.FC<ServiceCatalogViewProps> = ({
  currentAddress,
  onOpenLocationModal,
  onAutoDetectLocation,
  isLocating,
  onSelectServiceToBook,
  onAddToCart,
  initialCategorySlug,
  onOpenCategoriesPage,
  onOpenServicesPage,
  customerProfile,
  onOpenProfile,
  onSelectBookings,
  onOpenCart,
  onOpenWallet,
  onOpenSubscription,
  cartCount = 0,
  activeBookingsCount = 0
}) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Advertisement Slides Carousel State
  const [adSlides, setAdSlides] = useState<BannerSlide[]>(() => {
    const slides = getBannerSlides();
    const activeAds = slides.filter(s => s.is_active !== false && s.image_url);
    return activeAds.length > 0 ? activeAds : slides;
  });
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [isAdPaused, setIsAdPaused] = useState<boolean>(false);

  // Load Categories & Advertisement Slides on mount
  useEffect(() => {
    async function loadCats() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCats();

    const loadAds = () => {
      const slides = getBannerSlides();
      const activeAds = slides.filter(s => s.is_active !== false && s.image_url);
      setAdSlides(activeAds.length > 0 ? activeAds : slides);
    };
    loadAds();

    const handleAdUpdate = () => loadAds();
    const handleServiceUpdate = () => {
      fetchServices(selectedCategory, searchQuery).then(setServices);
    };

    window.addEventListener('doorbly_banners_updated', handleAdUpdate);
    window.addEventListener('doorbly_services_updated', handleServiceUpdate);

    return () => {
      window.removeEventListener('doorbly_banners_updated', handleAdUpdate);
      window.removeEventListener('doorbly_services_updated', handleServiceUpdate);
    };
  }, []);

  // Automatic slideshow rotation for advertisements every 4.5 seconds
  useEffect(() => {
    if (adSlides.length <= 1 || isAdPaused) return;
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [adSlides.length, isAdPaused]);

  // Update selectedCategory if initialCategorySlug changes
  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  // Fetch services when category or search changes
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setVisibleCount(36);

    const timer = setTimeout(() => {
      fetchServices(selectedCategory, searchQuery)
        .then((data) => {
          if (isCurrent) {
            setServices(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isCurrent) setLoading(false);
        });
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);
  const currentAd = adSlides[currentAdIndex] || adSlides[0];

  const handlePrevAd = () => {
    if (adSlides.length > 1) {
      setCurrentAdIndex((prev) => (prev - 1 + adSlides.length) % adSlides.length);
    }
  };

  const handleNextAd = () => {
    if (adSlides.length > 1) {
      setCurrentAdIndex((prev) => (prev + 1) % adSlides.length);
    }
  };

  const handleAdClick = (slide: BannerSlide) => {
    if (slide.cta_category_slug) {
      if (slide.cta_category_slug === 'all') {
        setSelectedCategory('all');
      } else {
        setSelectedCategory(slide.cta_category_slug);
      }
    }
  };

  const getCategoryGlow = (slug: string): GlowColor => {
    if (slug.includes('electrical') || slug.includes('tech') || slug.includes('appliance')) return 'cyan';
    if (slug.includes('clean') || slug.includes('agri') || slug.includes('garden') || slug.includes('farm') || slug.includes('livestock')) return 'emerald';
    if (slug.includes('paint') || slug.includes('event') || slug.includes('handicraft') || slug.includes('tailor') || slug.includes('beauty')) return 'amber';
    return 'indigo';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Advertisement Image Slides Banner - Clean, Unobstructed & Fully Responsive Across Screens */}
      {currentAd && (
        <section
          aria-label="Promotions and advertisements"
          className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-sm border border-slate-200/80 bg-slate-950 group select-none"
          onMouseEnter={() => setIsAdPaused(true)}
          onMouseLeave={() => setIsAdPaused(false)}
        >
          {/* Ad Image Container with Responsive Aspect Ratios & Heights for Mobile, Tablet, Desktop & Ultrawide */}
          <div 
            onClick={() => handleAdClick(currentAd)}
            className={`relative w-full aspect-21/9 sm:aspect-16/7 md:aspect-18/7 lg:aspect-21/8 min-h-[140px] max-h-[380px] overflow-hidden bg-slate-950 flex items-center justify-center ${currentAd.cta_category_slug ? 'cursor-pointer' : ''}`}
          >
            {currentAd.image_url ? (
              <img
                src={currentAd.image_url}
                alt={currentAd.title || 'Advertisement'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full bg-slate-900" />
            )}

            {/* Quick Dismiss Button */}
            <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-4 z-20">
              <button
                type="button"
                id="btn-dismiss-ad-slides"
                onClick={(e) => {
                  e.stopPropagation();
                  setAdSlides([]);
                }}
                className="p-1 sm:p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/50 backdrop-blur-xs transition-colors cursor-pointer"
                title="Hide advertisement"
                aria-label="Hide advertisement slide"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Carousel Navigation Arrows - Always Accessible & Responsive */}
            {adSlides.length > 1 && (
              <>
                <button
                  type="button"
                  id="btn-prev-ad-slide"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevAd();
                  }}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700/60 backdrop-blur-xs transition-all opacity-70 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title="Previous image slide"
                  aria-label="Previous advertisement slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  id="btn-next-ad-slide"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextAd();
                  }}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700/60 backdrop-blur-xs transition-all opacity-70 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title="Next image slide"
                  aria-label="Next advertisement slide"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </>
            )}

            {/* Bottom Dot Indicators - Adaptive Scale & Padding */}
            {adSlides.length > 1 && (
              <div className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-4 z-20 flex items-center gap-1 sm:gap-1.5 bg-slate-950/60 px-2 sm:px-2.5 py-1 rounded-full border border-slate-700/40 backdrop-blur-xs">
                {adSlides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentAdIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentAdIndex
                        ? 'w-3.5 sm:w-5 bg-white'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Advertisement slide ${idx + 1}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Catalog Services Area */}
      <div className="w-full mt-2">
          {/* Section Header: Explore Services & Find What You Need! */}
          <div className="mb-5">
            <div className="min-w-0 w-full overflow-hidden">
              <div className="overflow-hidden w-full relative py-0.5 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
                <div className="animate-marquee inline-flex items-center gap-8 whitespace-nowrap cursor-default">
                  <h2 className="text-xl sm:text-2xl font-normal text-emerald-800 tracking-tight inline-flex items-center">
                    Explore Services & Find What You Need!
                  </h2>
                  <span className="text-emerald-500/70 font-light select-none text-base">✦</span>
                  <span className="text-xl sm:text-2xl font-normal text-emerald-800 tracking-tight">
                    Explore Services & Find What You Need!
                  </span>
                  <span className="text-emerald-500/70 font-light select-none text-base">✦</span>
                  <span className="text-xl sm:text-2xl font-normal text-emerald-800 tracking-tight">
                    Explore Services & Find What You Need!
                  </span>
                  <span className="text-emerald-500/70 font-light select-none text-base">✦</span>
                  <span className="text-xl sm:text-2xl font-normal text-emerald-800 tracking-tight">
                    Explore Services & Find What You Need!
                  </span>
                  <span className="text-emerald-500/70 font-light select-none text-base">✦</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                {activeCategoryObj
                  ? `Browsing ${activeCategoryObj.name} • Verified hourly professionals ready to dispatch`
                  : 'Book verified hourly trade experts, doorstep technicians, and home care across Odisha'}
              </p>
            </div>
          </div>

          {/* Search Input Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-xs">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                id="input-service-search"
                placeholder={activeCategoryObj ? `Search within ${activeCategoryObj.name} (or type any hourly skill)...` : "Search verified hourly skills (e.g. Babysitter, Electrician, Carpenter, Cleaning, AC)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 p-0.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedCategory !== 'all' && activeCategoryObj && (
              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-medium">Active Tray Category:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {activeCategoryObj.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer text-xs"
                >
                  Reset to All Categories
                </button>
              </div>
            )}
          </div>

          {/* View Mode: Filtered Service List or Category Selection Guide */}
          {selectedCategory !== 'all' || searchQuery ? (
            <div className="animate-in fade-in duration-200">
              {/* Category Spotlight Header (When selected from tray) */}
              {activeCategoryObj && !searchQuery && (
                <div className="mb-6 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-7 border border-emerald-500/20 shadow-xl shadow-slate-950/40">
                  {/* Subtle glowing ambient lights */}
                  <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl" />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]" />

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/50 backdrop-blur-sm">
                          <CategoryIcon
                            name={CATEGORIES_MASTER.find(m => m.slug === activeCategoryObj.slug)?.icon || 'Wrench'}
                            className="w-7 h-7"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 shadow-xs ring-2 ring-slate-950">
                          ✓
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            Trade #{CATEGORIES_MASTER.findIndex(m => m.slug === activeCategoryObj.slug) + 1} of 50
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-medium border border-white/10">
                            <ShieldCheck className="w-3 h-3 text-teal-300" />
                            100% Background Verified
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-xs">
                          {activeCategoryObj.name}
                        </h2>
                        <p className="text-xs text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
                          {activeCategoryObj.description || `Verified hourly ${activeCategoryObj.name} doorstep service partners across Odisha.`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                      <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center">
                        <span className="block text-sm font-black text-emerald-300">{services.length}</span>
                        <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-300">Available Skills</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Grid */}
              {loading ? (
                <div className="py-20 text-center text-slate-500 text-sm">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Loading verified services...
                </div>
              ) : services.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
                  <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No services found</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    No service partner is currently listed for "{searchQuery}". Try selecting another trade category from the vertical tray on the left.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Clear Search & View Categories
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4.5">
                    {services.slice(0, visibleCount).map((service) => (
                      <ServiceCard
                        key={service.id || service.slug}
                        service={service}
                        onBook={onSelectServiceToBook}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>

                  {/* Show More Services Button if more exist */}
                  {services.length > visibleCount && (
                    <div className="pt-4 pb-2 text-center">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 36)}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 hover:border-emerald-500"
                      >
                        <span>Show More Services ({services.length - visibleCount} remaining)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Default View: Popular Trade Category Selection Guidance (No 978-service dump) */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Popular Trade Quick-Pick Chips */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Popular Trade Categories
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Odisha Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                    {[
                      { slug: 'electrical-services', name: 'Electrical Work', icon: 'Zap' },
                      { slug: 'plumbing-services', name: 'Plumbing Services', icon: 'Droplets' },
                      { slug: 'home-repair-maintenance', name: 'Carpentry & Repairs', icon: 'Wrench' },
                      { slug: 'ac-appliance-services', name: 'AC & Appliances', icon: 'Tv' },
                      { slug: 'cleaning-housekeeping', name: 'Cleaning Services', icon: 'Sparkles' },
                      { slug: 'painting-polishing', name: 'Painting & Putty', icon: 'Paintbrush' },
                      { slug: 'computer-mobile-technology', name: 'Computer & Mobile', icon: 'Monitor' },
                      { slug: 'vehicle-services', name: 'Vehicle & Mechanic', icon: 'Car' },
                      { slug: 'baby-child-care', name: 'Babysitter & Care', icon: 'Baby' },
                      { slug: 'cooking-kitchen-services', name: 'Cooking & Chef', icon: 'Utensils' },
                      { slug: 'moving-loading-manpower', name: 'Movers & Helpers', icon: 'Package' },
                      { slug: 'gardening-landscaping', name: 'Gardening & Lawn', icon: 'Flower2' }
                    ].map((trade) => (
                      <button
                        key={trade.slug}
                        onClick={() => setSelectedCategory(trade.slug)}
                        id={`quick-trade-${trade.slug}`}
                        className="p-3 rounded-2xl bg-gradient-to-br from-white to-slate-50/80 hover:to-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 text-left transition-all duration-150 cursor-pointer group flex items-center gap-2.5 shadow-2xs hover:shadow-xs active:scale-95"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-800 flex items-center justify-center shrink-0 border border-slate-200/70 group-hover:border-emerald-300 shadow-2xs transition-colors">
                          <CategoryIcon name={trade.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 truncate block">
                            {trade.name}
                          </span>
                          <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 block">
                            Explore →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Complete Catalog Directory Banner */}
                  {onOpenServicesPage && (
                    <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30 shadow-md">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30 shrink-0">
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            Looking for all 978+ services we provide?
                          </h3>
                          <p className="text-xs text-slate-300">
                            Explore our comprehensive master directory across all 50 trade categories.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenServicesPage}
                        id="btn-catalog-view-all-services"
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                      >
                        <span>View All Services Directory</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
  );
};
