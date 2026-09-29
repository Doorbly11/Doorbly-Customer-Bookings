import type React from 'react';
import { Service, BannerSlide, AppBranding } from '../types';
import { SERVICES_MASTER, CATEGORIES_MASTER } from '../data/serviceCatalogMaster';
import { idbGet, idbSet } from './idbStore';

export const ADMIN_EMAIL = 'debabrata.tribune@gmail.com';
export const ADMIN_PASSWORD = 'Devraj@1122';

const STORAGE_KEY_ADMIN_AUTH = 'doorbly_admin_auth_v1';
const STORAGE_KEY_SERVICES = 'doorbly_custom_services_v1';
const STORAGE_KEY_BANNERS = 'doorbly_banner_slides_v4';
const STORAGE_KEY_BRANDING = 'doorbly_custom_branding_v1';

// Clean up old legacy keys that consume localStorage quota
function cleanupLegacyStorage(): void {
  if (typeof window === 'undefined') return;
  const legacyKeys = [
    'doorbly_banner_slides',
    'doorbly_banner_slides_v1',
    'doorbly_banner_slides_v2',
    'doorbly_banner_slides_v3',
    'doorbly_custom_services'
  ];
  legacyKeys.forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  });
}
cleanupLegacyStorage();

export interface BannerGradientConfig {
  className: string;
  style: React.CSSProperties;
  orb1Color: string;
  orb2Color: string;
  borderClass: string;
}

export function getBannerGradientInfo(slide?: BannerSlide): BannerGradientConfig {
  const grad = slide?.bg_gradient || '';
  const id = slide?.id || '';

  // Direct CSS gradient support
  if (grad.startsWith('linear-gradient') || grad.startsWith('radial-gradient')) {
    return {
      className: 'bg-slate-950',
      style: { background: grad },
      orb1Color: 'bg-indigo-400/30',
      orb2Color: 'bg-blue-400/25',
      borderClass: 'border-indigo-500/30'
    };
  }

  if (id === 'slide-2' || grad.includes('emerald') || grad.includes('teal')) {
    return {
      className: 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950',
      style: {
        background: 'linear-gradient(135deg, #065f46 0%, #042f2e 40%, #022c22 75%, #020617 100%)'
      },
      orb1Color: 'bg-emerald-400/35',
      orb2Color: 'bg-teal-400/30',
      borderClass: 'border-emerald-500/40'
    };
  }

  if (id === 'slide-3' || grad.includes('purple') || grad.includes('violet') || grad.includes('blue-900') || grad.includes('agri')) {
    return {
      className: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950',
      style: {
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e1b4b 40%, #4c1d95 75%, #09090b 100%)'
      },
      orb1Color: 'bg-blue-400/35',
      orb2Color: 'bg-purple-400/30',
      borderClass: 'border-indigo-500/40'
    };
  }

  if (grad.includes('rose') || grad.includes('red') || grad.includes('amber') || grad.includes('orange')) {
    return {
      className: 'bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950',
      style: {
        background: 'linear-gradient(135deg, #881337 0%, #4c0519 40%, #1c1917 75%, #451a03 100%)'
      },
      orb1Color: 'bg-rose-400/35',
      orb2Color: 'bg-amber-400/30',
      borderClass: 'border-rose-500/40'
    };
  }

  if (grad.includes('cyan')) {
    return {
      className: 'bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950',
      style: {
        background: 'linear-gradient(135deg, #0e7490 0%, #083344 40%, #172554 75%, #020617 100%)'
      },
      orb1Color: 'bg-cyan-400/35',
      orb2Color: 'bg-blue-400/30',
      borderClass: 'border-cyan-500/40'
    };
  }

  // Default: Royal Indigo & Sapphire Glow (Slide 1 and default)
  return {
    className: 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-blue-950',
    style: {
      background: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 40%, #0f172a 75%, #1e3a8a 100%)'
    },
    orb1Color: 'bg-indigo-400/40',
    orb2Color: 'bg-blue-400/35',
    borderClass: 'border-indigo-500/40'
  };
}

// Default initial banner slides with rich, vibrant modern gradients
export const DEFAULT_BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    title: 'Book Verified Hourly Helpers & Technicians',
    subtitle: 'Transparent hourly pricing for 978+ doorstep services across 50 categories in all 30 districts of Odisha. Only pay for the exact hours booked.',
    badge: "Odisha's Verified Hourly Marketplace",
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Explore All Services',
    cta_category_slug: 'all',
    bg_gradient: 'from-indigo-900 via-indigo-950 to-blue-950',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'slide-2',
    title: 'Monsoon & Seasonal Home Deep Care',
    subtitle: 'Certified AC technicians, waterproofing experts, electricians, and deep cleaning professionals ready at your doorstep.',
    badge: 'Seasonal Top Pick',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Book Cleaning & AC',
    cta_category_slug: 'cleaning-household',
    bg_gradient: 'from-emerald-900 via-teal-950 to-slate-900',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'slide-3',
    title: 'Skilled Agricultural & Rural Manpower',
    subtitle: 'On-demand hourly helpers for farming, tractor driving, harvest, pond maintenance, and rural construction.',
    badge: 'Rural & Agricultural Network',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Explore Farm Services',
    cta_category_slug: 'agriculture-farm-work',
    bg_gradient: 'from-blue-900 via-indigo-950 to-purple-950',
    is_active: true,
    sort_order: 3
  }
];

export const DEFAULT_BRANDING: AppBranding = {
  brand_name: 'DOORBLY',
  tagline: 'Odisha Doorstep Services',
  logo_letter: 'D',
  logo_url: '/doorbly-logo.png',
  accent_color: '#4f46e5'
};

// ==========================================
// 1. ADMIN AUTHENTICATION
// ==========================================
export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass.trim() === ADMIN_PASSWORD.trim();
}

export function isAdminLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.is_admin === true && parsed?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

export function setAdminSession(active: boolean): void {
  if (active) {
    localStorage.setItem(
      STORAGE_KEY_ADMIN_AUTH,
      JSON.stringify({
        is_admin: true,
        email: ADMIN_EMAIL,
        logged_in_at: new Date().toISOString()
      })
    );
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  }
  window.dispatchEvent(new Event('doorbly_admin_auth_changed'));
}

// ==========================================
// 2. SERVICES CRUD
// ==========================================
const STORAGE_KEY_SERVICES_VERSION = 'doorbly_services_catalog_version';
const CURRENT_CATALOG_VERSION = 'v50_978_hourly_final';

export function getCustomServices(): Service[] {
  try {
    const storedVersion = localStorage.getItem(STORAGE_KEY_SERVICES_VERSION);
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);

    if (raw && storedVersion === CURRENT_CATALOG_VERSION) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= SERVICES_MASTER.length) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse custom services:', err);
  }

  // Authoritative initialize from master catalog (50 categories & 978 services)
  const initial: Service[] = SERVICES_MASTER.map((s, idx) => ({
    id: `srv-${idx + 1}`,
    name: s.name,
    slug: s.slug,
    category_name: s.category_name,
    category_slug: s.category_slug,
    category_id: `cat-${s.category_slug}`,
    description: s.description,
    pricing_type: 'hourly' as const,
    pricing_unit: 'hour' as const,
    customer_price: s.customer_price,
    customer_hourly_price: s.customer_hourly_price,
    base_hourly_rate: s.base_hourly_rate,
    partner_hourly_rate: s.partner_hourly_rate,
    agent_payout: s.agent_payout,
    doorbly_commission: s.doorbly_commission,
    commission_percentage: s.commission_percentage,
    minimum_hours: s.minimum_hours,
    maximum_hours: s.maximum_hours,
    verification_required: s.verification_required,
    is_active: true,
    image_url: undefined
  }));

  try {
    localStorage.setItem(STORAGE_KEY_SERVICES_VERSION, CURRENT_CATALOG_VERSION);
    saveCustomServices(initial);
  } catch (e) {
    console.warn('Could not persist catalog to localStorage', e);
  }
  return initial;
}

export function saveCustomServices(services: Service[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  } catch (err) {
    console.warn('Could not save full services catalog to localStorage (quota reached). Saved in IndexedDB.', err);
  }
  idbSet(STORAGE_KEY_SERVICES, services);
  window.dispatchEvent(new Event('doorbly_services_updated'));
}

export function addCustomService(newService: Omit<Service, 'id' | 'slug'> & { slug?: string }): Service {
  const list = getCustomServices();
  const generatedSlug = (newService.slug || newService.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const fullService: Service = {
    ...newService,
    id: `srv-custom-${Date.now()}`,
    slug: `${newService.category_slug || 'general'}--${generatedSlug}`,
    is_active: newService.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updated = [fullService, ...list];
  saveCustomServices(updated);
  return fullService;
}

export function updateCustomService(id: string, updates: Partial<Service>): Service | null {
  const list = getCustomServices();
  const index = list.findIndex(s => s.id === id || s.slug === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedItem: Service = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString()
  };

  list[index] = updatedItem;
  saveCustomServices(list);
  return updatedItem;
}

export function deleteCustomService(id: string): boolean {
  const list = getCustomServices();
  const filtered = list.filter(s => s.id !== id && s.slug !== id);
  if (filtered.length !== list.length) {
    saveCustomServices(filtered);
    return true;
  }
  return false;
}

export function resetServicesToMaster(): void {
  localStorage.removeItem(STORAGE_KEY_SERVICES);
  getCustomServices();
  window.dispatchEvent(new Event('doorbly_services_updated'));
}

// ==========================================
// 3. BANNER SLIDES CRUD
// ==========================================
let inMemoryBannerSlides: BannerSlide[] | null = null;

// Initialize from IndexedDB in the background
if (typeof window !== 'undefined') {
  idbGet<BannerSlide[]>(STORAGE_KEY_BANNERS).then((idbSlides) => {
    if (Array.isArray(idbSlides) && idbSlides.length > 0) {
      inMemoryBannerSlides = idbSlides;
      window.dispatchEvent(new Event('doorbly_banners_updated'));
    }
  }).catch(() => {});
}

export function getBannerSlides(): BannerSlide[] {
  if (inMemoryBannerSlides && inMemoryBannerSlides.length > 0) {
    return inMemoryBannerSlides;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANNERS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          inMemoryBannerSlides = [];
          return [];
        }
        const upgraded = parsed.map(s => {
          // If slide had old blackish, hex, or low-contrast gradient, upgrade to vivid modern gradient
          const hasOldOrDullGradient = !s.bg_gradient || 
            s.bg_gradient.includes('#0c142b') || 
            s.bg_gradient.includes('#07241e') || 
            s.bg_gradient.includes('#0d1f33') || 
            s.bg_gradient.includes('#060a17') ||
            s.bg_gradient.includes('#041512') ||
            s.bg_gradient.includes('#08121f') ||
            s.bg_gradient.includes('from-slate-950') ||
            s.bg_gradient.includes('-50') || 
            s.bg_gradient.includes('-100') || 
            s.bg_gradient.includes('-200');

          if (hasOldOrDullGradient) {
            if (s.id === 'slide-1') {
              return { ...s, bg_gradient: 'from-indigo-900 via-indigo-950 to-blue-950' };
            }
            if (s.id === 'slide-2' || s.title?.toLowerCase().includes('monsoon') || s.title?.toLowerCase().includes('clean')) {
              return { ...s, bg_gradient: 'from-emerald-900 via-teal-950 to-slate-900' };
            }
            if (s.id === 'slide-3' || s.title?.toLowerCase().includes('agri') || s.title?.toLowerCase().includes('farm')) {
              return { ...s, bg_gradient: 'from-blue-900 via-indigo-950 to-purple-950' };
            }
            return { ...s, bg_gradient: 'from-indigo-900 via-indigo-950 to-blue-950' };
          }
          return s;
        });
        const sorted = upgraded.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        inMemoryBannerSlides = sorted;
        return sorted;
      }
    }
  } catch (err) {
    console.warn('Failed to parse banner slides from localStorage:', err);
  }

  inMemoryBannerSlides = DEFAULT_BANNER_SLIDES;
  saveBannerSlides(DEFAULT_BANNER_SLIDES);
  return DEFAULT_BANNER_SLIDES;
}

export function saveBannerSlides(slides: BannerSlide[]): void {
  inMemoryBannerSlides = slides;

  // 1. Asynchronously persist full slides (including high-res images) to IndexedDB
  idbSet(STORAGE_KEY_BANNERS, slides);

  // 2. Dispatch event immediately so all UI components update smoothly
  window.dispatchEvent(new Event('doorbly_banners_updated'));

  // 3. Try to save to localStorage safely without throwing QuotaExceededError
  try {
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(slides));
  } catch (err) {
    console.warn('Quota reached while saving banner slides to localStorage. Using lightweight mirror; full data saved in IndexedDB.', err);
    try {
      cleanupLegacyStorage();
      // If a slide has a huge data URL, create a lightweight copy for localStorage
      const lightweight = slides.map(s => {
        if (s.image_url && s.image_url.startsWith('data:') && s.image_url.length > 20000) {
          // Keep slide metadata in localStorage, image will be retrieved from IndexedDB / in-memory cache
          return { ...s, image_url: s.image_url.slice(0, 50) + '...[cached_in_idb]' };
        }
        return s;
      });
      localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(lightweight));
    } catch {
      // Even if localStorage is completely exhausted, the app continues without error
    }
  }
}

export function addBannerSlide(slide: Omit<BannerSlide, 'id'>): BannerSlide {
  const slides = getBannerSlides();
  const newSlide: BannerSlide = {
    ...slide,
    id: `slide-${Date.now()}`,
    sort_order: slide.sort_order || slides.length + 1,
    created_at: new Date().toISOString()
  };
  const updated = [...slides, newSlide];
  saveBannerSlides(updated);
  return newSlide;
}

export function updateBannerSlide(id: string, updates: Partial<BannerSlide>): BannerSlide | null {
  const slides = getBannerSlides();
  const index = slides.findIndex(s => s.id === id);
  if (index === -1) return null;

  slides[index] = {
    ...slides[index],
    ...updates
  };
  saveBannerSlides(slides);
  return slides[index];
}

export function deleteBannerSlide(id: string): boolean {
  const slides = getBannerSlides();
  const filtered = slides.filter(s => s.id !== id);
  if (filtered.length !== slides.length) {
    saveBannerSlides(filtered);
    return true;
  }
  return false;
}

export function resetBannerSlides(): void {
  saveBannerSlides(DEFAULT_BANNER_SLIDES);
}

// ==========================================
// 4. BRANDING & LOGO
// ==========================================
export function getBranding(): AppBranding {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BRANDING);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_BRANDING,
          ...parsed,
          logo_url: parsed.logo_url && parsed.logo_url.trim() !== '' ? parsed.logo_url : '/doorbly-logo.png'
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse custom branding:', err);
  }
  return DEFAULT_BRANDING;
}

export function saveBranding(branding: AppBranding): void {
  try {
    localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));
  } catch (err) {
    console.warn('Could not save branding to localStorage (quota reached):', err);
  }
  idbSet(STORAGE_KEY_BRANDING, branding);
  window.dispatchEvent(new Event('doorbly_branding_updated'));
}

export function resetBranding(): void {
  localStorage.removeItem(STORAGE_KEY_BRANDING);
  window.dispatchEvent(new Event('doorbly_branding_updated'));
}
