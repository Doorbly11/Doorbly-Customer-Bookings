import React, { useState, useEffect } from 'react';
import { AppBranding } from '../types';
import { getBranding } from '../lib/adminStore';
import { Menu, Smartphone } from 'lucide-react';

interface NavbarProps {
  onSelectView?: (view: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin') => void;
  onOpenDrawer?: () => void;
  onOpenPlayStore?: () => void;
  activeView?: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin';
  currentAddress?: any;
  onOpenLocationModal?: () => void;
  onAutoDetectLocation?: () => void;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
  customerProfile?: any;
  activeBookingsCount?: number;
  networkStatus?: any;
  locationStatus?: any;
  onGoBack?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenWallet?: () => void;
  onOpenSubscription?: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectView,
  onOpenDrawer,
  onOpenPlayStore,
  activeView = 'catalog'
}) => {
  const [branding, setBranding] = useState<AppBranding>(getBranding());

  useEffect(() => {
    const handleBrandingSync = () => setBranding(getBranding());
    window.addEventListener('doorbly_branding_updated', handleBrandingSync);
    return () => {
      window.removeEventListener('doorbly_branding_updated', handleBrandingSync);
    };
  }, []);

  const navLinks: {
    id: string;
    label: string;
    view: 'catalog' | 'services' | 'categories' | 'bookings' | 'support';
    badge?: string;
  }[] = [
    { id: 'nav-link-home', label: 'Home', view: 'catalog' },
    { id: 'nav-link-services', label: 'Services', view: 'services', badge: '978+' },
    { id: 'nav-link-categories', label: 'Categories', view: 'categories' },
    { id: 'nav-link-bookings', label: 'My Bookings', view: 'bookings' },
    { id: 'nav-link-support', label: 'Help', view: 'support' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Company Name */}
          <button
            onClick={() => onSelectView?.('catalog')}
            id="btn-header-brand"
            className="flex items-center gap-3 text-left cursor-pointer group focus:outline-none"
            title="Doorbly Home"
          >
            {branding.logo_url ? (
              <img
                src={branding.logo_url}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
            ) : (
              <img
                src="/doorbly-logo.png"
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
            )}
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
                {branding.brand_name || 'DOORBLY'}
              </span>
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                {branding.tagline || 'Odisha Doorstep Services'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.id}
                  id={item.id}
                  type="button"
                  onClick={() => onSelectView?.(item.view)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {onOpenPlayStore && (
              <button
                onClick={onOpenPlayStore}
                type="button"
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
                title="Android App & Google Play Store Hub"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android App</span>
              </button>
            )}
          </nav>

          {/* Right Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenPlayStore && (
              <button
                onClick={onOpenPlayStore}
                type="button"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                title="Android App Hub"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>App</span>
              </button>
            )}

            {/* Responsive Menu Navigator Button (Mobile & Small screens) */}
            {onOpenDrawer && (
              <button
                onClick={onOpenDrawer}
                id="btn-header-mobile-menu"
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80 transition-all cursor-pointer active:scale-95 text-xs font-bold"
                title="Open Navigation Menu"
                aria-label="Open Menu Navigator"
              >
                <Menu className="w-4 h-4 text-indigo-600" />
                <span>Menu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
