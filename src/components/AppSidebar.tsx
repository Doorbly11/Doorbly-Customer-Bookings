import React, { useState, useEffect } from 'react';
import { CustomerAddress, CustomerProfile, AppBranding } from '../types';
import { getBranding, isAdminLoggedIn } from '../lib/adminStore';
import { RealLocationDetails } from '../lib/useDeviceStatus';
import {
  LayoutGrid,
  Layers,
  User,
  CalendarCheck,
  ShoppingCart,
  Wallet,
  Crown,
  HelpCircle,
  ShieldCheck,
  Search,
  Bell,
  MapPin,
  Navigation,
  ChevronLeft,
  ChevronRight,
  X,
  PhoneCall,
  Sparkles,
  LogOut,
  ExternalLink,
  Home,
  Smartphone
} from 'lucide-react';

export interface AppSidebarProps {
  activeView: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin';
  onSelectView: (view: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin') => void;
  currentAddress: CustomerAddress;
  onOpenLocationModal: () => void;
  onAutoDetectLocation?: () => void;
  locationStatus?: RealLocationDetails;
  customerProfile: CustomerProfile;
  activeBookingsCount?: number;
  cartCount?: number;
  unreadNotificationsCount?: number;
  onOpenProfile: () => void;
  onOpenCart: () => void;
  onOpenWallet: () => void;
  onOpenSubscription: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenAdminModal?: () => void;
  onOpenPlayStore?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeView,
  onSelectView,
  currentAddress,
  onOpenLocationModal,
  onAutoDetectLocation,
  locationStatus,
  customerProfile,
  activeBookingsCount = 0,
  cartCount = 0,
  unreadNotificationsCount = 0,
  onOpenProfile,
  onOpenCart,
  onOpenWallet,
  onOpenSubscription,
  onOpenSearch,
  onOpenNotifications,
  onOpenAdminModal,
  onOpenPlayStore,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [branding, setBranding] = useState<AppBranding>(getBranding());
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminLoggedIn());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleBrandingSync = () => setBranding(getBranding());
    const handleAdminAuthSync = () => setIsAdmin(isAdminLoggedIn());

    window.addEventListener('doorbly_branding_updated', handleBrandingSync);
    window.addEventListener('doorbly_admin_auth_changed', handleAdminAuthSync);

    return () => {
      window.removeEventListener('doorbly_branding_updated', handleBrandingSync);
      window.removeEventListener('doorbly_admin_auth_changed', handleAdminAuthSync);
    };
  }, []);

  const isGpsLive = Boolean(locationStatus?.coords);
  const cityName = currentAddress?.city || 'Bhubaneswar';
  const displayName = customerProfile?.full_name?.trim() || 'Debabrata';
  const displayInitial = displayName.charAt(0).toUpperCase() || 'D';

  const menuItems = [
    {
      id: 'sidebar-menu-home',
      label: 'Home',
      sublabel: 'Featured & Offers',
      icon: Home,
      isActive: activeView === 'catalog',
      onClick: () => {
        onSelectView('catalog');
        onCloseMobile?.();
      }
    },
    {
      id: 'sidebar-menu-services',
      label: 'All Services',
      sublabel: '978+ Hourly Trades',
      icon: LayoutGrid,
      isActive: activeView === 'services',
      onClick: () => {
        onSelectView('services');
        onCloseMobile?.();
      },
      badge: '978+'
    },
    {
      id: 'sidebar-menu-categories',
      label: 'Categories',
      sublabel: '50 Departments',
      icon: Layers,
      isActive: activeView === 'categories',
      onClick: () => {
        onSelectView('categories');
        onCloseMobile?.();
      }
    },
    {
      id: 'sidebar-menu-profile',
      label: 'Profile',
      sublabel: 'Account & Info',
      icon: User,
      isActive: false,
      onClick: () => {
        onOpenProfile();
        onCloseMobile?.();
      }
    },
    {
      id: 'sidebar-menu-bookings',
      label: 'Bookings',
      sublabel: 'Order History',
      icon: CalendarCheck,
      isActive: activeView === 'bookings',
      onClick: () => {
        onSelectView('bookings');
        onCloseMobile?.();
      },
      count: activeBookingsCount,
      countColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'sidebar-menu-cart',
      label: 'Cart',
      sublabel: 'Bookings Tray',
      icon: ShoppingCart,
      isActive: false,
      onClick: () => {
        onOpenCart();
        onCloseMobile?.();
      },
      count: cartCount,
      countColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'sidebar-menu-wallet',
      label: 'Wallet',
      sublabel: 'Credits & Passbook',
      icon: Wallet,
      isActive: false,
      onClick: () => {
        onOpenWallet();
        onCloseMobile?.();
      },
      pill: '₹0.00'
    },
    {
      id: 'sidebar-menu-subscription',
      label: 'My Subscription',
      sublabel: 'Doorbly Plus VIP',
      icon: Crown,
      isActive: false,
      onClick: () => {
        onOpenSubscription();
        onCloseMobile?.();
      },
      pill: 'VIP',
      pillColor: 'bg-amber-100 text-amber-800 border-amber-300/80'
    }
  ];

  const secondaryItems = [
    ...(onOpenPlayStore
      ? [
          {
            id: 'sidebar-menu-playstore',
            label: 'Android & Play Store',
            icon: Smartphone,
            isActive: false,
            onClick: () => {
              onOpenPlayStore();
              onCloseMobile?.();
            },
            pill: 'Install',
            pillColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
          }
        ]
      : []),
    {
      id: 'sidebar-menu-support',
      label: 'Help & Support',
      icon: HelpCircle,
      isActive: activeView === 'support',
      onClick: () => {
        onSelectView('support');
        onCloseMobile?.();
      }
    },
    ...(isAdmin || onOpenAdminModal
      ? [
          {
            id: 'sidebar-menu-admin',
            label: 'Admin Panel',
            icon: ShieldCheck,
            isActive: activeView === 'admin',
            onClick: () => {
              if (onOpenAdminModal) {
                onOpenAdminModal();
              } else {
                onSelectView('admin');
              }
              onCloseMobile?.();
            },
            pill: 'Staff',
            pillColor: 'bg-rose-100 text-rose-700 border-rose-200'
          }
        ]
      : [])
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200/80 select-none shadow-xs">
      {/* 1. Header: Brand Logo & Title */}
      <div className={`p-4 border-b border-slate-100 flex items-center justify-between gap-2 ${isCollapsed ? 'px-3' : ''}`}>
        <button
          onClick={() => {
            onSelectView('catalog');
            onCloseMobile?.();
          }}
          className="flex items-center gap-3 text-left cursor-pointer group min-w-0"
          title="Go to Doorbly Home"
        >
          {branding.logo_url ? (
            <img
              src={branding.logo_url}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-contain drop-shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <img
              src="/doorbly-logo.png"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-contain drop-shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
            />
          )}

          {!isCollapsed && (
            <div className="min-w-0 truncate">
              <span className="text-lg font-black tracking-tight text-slate-900 font-['Outfit'] block leading-tight truncate">
                {branding.brand_name || 'DOORBLY'}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                {branding.tagline || 'Odisha Doorstep Services'}
              </span>
            </div>
          )}
        </button>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Location & GPS Live Badge */}
      {!isCollapsed ? (
        <div className="p-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between gap-1.5 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => {
                onOpenLocationModal();
                onCloseMobile?.();
              }}
              className="flex items-center gap-2 text-left cursor-pointer min-w-0 flex-1 hover:text-indigo-600 transition-colors"
              title="Change Service Location"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {cityName}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    GPS Live
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  {currentAddress?.area || 'Tap to switch city'}
                </span>
              </div>
            </button>

            {onAutoDetectLocation && (
              <button
                onClick={onAutoDetectLocation}
                disabled={locationStatus?.isLocating}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
                title="Auto detect device GPS"
              >
                <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${locationStatus?.isLocating ? 'animate-spin text-emerald-500' : ''}`} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-2.5 flex justify-center border-b border-slate-100">
          <button
            onClick={() => {
              onOpenLocationModal();
              onCloseMobile?.();
            }}
            className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            title={`${cityName} • GPS Live`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* 3. Main Navigation Menu: Services, Categories, Profile, Bookings, Cart, Wallet, My Subscription */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 pt-1 pb-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Menu Navigation
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={item.onClick}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group active:scale-98 ${
                item.isActive
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-2xs border border-indigo-100'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100/90'
              } ${isCollapsed ? 'justify-center px-2 py-3' : ''}`}
            >
              <div className={`relative flex items-center justify-center ${item.isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {isCollapsed && item.count !== undefined && item.count > 0 && (
                  <span className={`absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${item.countColor || 'bg-indigo-600 text-white'}`}>
                    {item.count}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className="text-left truncate">
                    <span className="block truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.countColor || 'bg-indigo-600 text-white'}`}>
                        {item.count}
                      </span>
                    )}
                    {item.pill && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${item.pillColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {item.pill}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="pt-3 pb-1">
          <div className="border-t border-slate-100" />
        </div>

        {!isCollapsed && (
          <div className="px-3 pt-1 pb-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Quick Tools
          </div>
        )}

        {/* Global Search Shortcut */}
        {onOpenSearch && (
          <button
            onClick={() => {
              onOpenSearch();
              onCloseMobile?.();
            }}
            title={isCollapsed ? 'Search Services (⌘K)' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>Quick Search</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-400">⌘K</span>
              </div>
            )}
          </button>
        )}

        {/* Notifications Shortcut */}
        {onOpenNotifications && (
          <button
            onClick={() => {
              onOpenNotifications();
              onCloseMobile?.();
            }}
            title={isCollapsed ? 'Notifications' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <div className="relative">
              <Bell className="w-4 h-4 text-slate-400 shrink-0" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
            )}
          </button>
        )}

        {/* Secondary items: Help & Admin */}
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={item.onClick}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                item.isActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.pill && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold border ${item.pillColor}`}>
                      {item.pill}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Bottom Customer Profile Block */}
      <div className={`p-3 border-t border-slate-100 bg-slate-50/70 ${isCollapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => {
            onOpenProfile();
            onCloseMobile?.();
          }}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-2xs transition-all cursor-pointer text-left ${
            isCollapsed ? 'justify-center p-1.5' : ''
          }`}
          title={isCollapsed ? `${displayName} • Account` : undefined}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
            {displayInitial}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block truncate">
                • Registered Customer
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Persistent Left-Hand Side Menu Bar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen z-30 transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-64 xl:w-68'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Left-Hand Side Menu Bar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content sliding from left */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
