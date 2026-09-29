import React from 'react';
import { CustomerAddress, CustomerProfile } from '../types';
import { RealLocationDetails } from '../lib/useDeviceStatus';
import {
  Home,
  User,
  CalendarCheck,
  ShoppingCart,
  Wallet,
  Crown,
  Wrench,
  FolderTree,
  Search,
  MapPin,
  Bell,
  Headphones,
  HelpCircle,
  AlertTriangle,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  currentAddress: CustomerAddress;
  locationStatus?: RealLocationDetails;
  customerProfile: CustomerProfile;
  activeBookingsCount?: number;
  cartCount?: number;
  unreadNotificationsCount?: number;
  activeView: 'catalog' | 'categories' | 'bookings' | 'support' | 'admin';
  // Action handlers
  onSelectHome: () => void;
  onOpenProfile: () => void;
  onSelectBookings: () => void;
  onOpenCart: () => void;
  onOpenWallet: () => void;
  onOpenSubscription: () => void;
  onSelectAllServices: () => void;
  onSelectCategories: () => void;
  onOpenSearch: () => void;
  onOpenLocation: () => void;
  onOpenNotifications: () => void;
  onOpenSupport: () => void;
  onOpenFaq: () => void;
  onOpenComplaints: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  isMobile = false,
  currentAddress,
  locationStatus,
  customerProfile,
  activeBookingsCount = 0,
  cartCount = 0,
  unreadNotificationsCount = 0,
  activeView,
  onSelectHome,
  onOpenProfile,
  onSelectBookings,
  onOpenCart,
  onOpenWallet,
  onOpenSubscription,
  onSelectAllServices,
  onSelectCategories,
  onOpenSearch,
  onOpenLocation,
  onOpenNotifications,
  onOpenSupport,
  onOpenFaq,
  onOpenComplaints,
  onOpenSettings,
  onLogout
}) => {
  // Real GPS Status logic
  const isGpsLive = Boolean(locationStatus?.coords);
  const isLocating = Boolean(locationStatus?.isLocating);
  const isPermissionDenied = locationStatus?.permissionState === 'denied';

  let gpsStatusText = 'Location detected';
  let gpsStatusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (isLocating) {
    gpsStatusText = 'Acquiring GPS...';
    gpsStatusColor = 'text-sky-700 bg-sky-50 border-sky-200';
  } else if (isGpsLive) {
    gpsStatusText = 'Live / Location detected';
    gpsStatusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (isPermissionDenied) {
    gpsStatusText = 'Permission Required';
    gpsStatusColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else {
    gpsStatusText = 'Location detected';
    gpsStatusColor = 'text-slate-700 bg-slate-100 border-slate-200';
  }

  // Dynamic customer name & initial
  const isAuthenticated = Boolean(
    customerProfile?.is_logged_in || customerProfile?.full_name?.trim() || customerProfile?.phone?.trim()
  );
  const displayName = customerProfile?.full_name?.trim() || (isAuthenticated ? 'Customer' : 'Guest User');
  const displayInitial = displayName.charAt(0).toUpperCase() || 'D';
  const contactSubtitle = customerProfile?.phone?.trim() 
    || customerProfile?.email?.trim() 
    || (isAuthenticated ? 'Registered Customer' : 'Sign in to access account');

  const cityName = currentAddress.city || 'Bhubaneswar';

  // Navigation Items Content Renderer
  const drawerContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none overflow-y-auto custom-scrollbar">
      {/* ========================================================
          1. HEADER: DOORBLY + Location Status
         ======================================================== */}
      <div className="p-5 pb-4 border-b border-slate-100 bg-slate-50/60 sticky top-0 z-10 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
              D
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg font-['Outfit'] block leading-none">
                DOORBLY
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                Customer Navigator
              </span>
            </div>
          </div>

          {/* Close button for drawer */}
          <button
            type="button"
            id="btn-close-navigator"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
            aria-label="Close navigation"
            title="Close Navigator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated Location Status */}
        <button
          type="button"
          id="nav-location-status-card"
          onClick={() => {
            onOpenLocation();
            if (isMobile) onClose();
          }}
          className="w-full text-left p-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{cityName} GPS Live</span>
            </div>

            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-extrabold shrink-0 shadow-2xs ${gpsStatusColor}`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isGpsLive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isGpsLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
              <span>{isGpsLive ? 'Live' : 'GPS'}</span>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">
              Location: <strong className="text-slate-700 font-semibold">{gpsStatusText}</strong>
            </span>
            <span className="text-emerald-700 font-bold group-hover:underline text-[10px]">
              Switch
            </span>
          </div>
        </button>
      </div>

      {/* ========================================================
          2. CUSTOMER PROFILE SECTION
         ======================================================== */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <button
          type="button"
          id="nav-customer-profile-block"
          onClick={() => {
            onOpenProfile();
            if (isMobile) onClose();
          }}
          className="w-full p-2 rounded-2xl hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group cursor-pointer border border-transparent hover:border-slate-200/60"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-sm shadow-indigo-600/20 shrink-0 group-hover:scale-105 transition-transform">
            {displayInitial}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {displayName}
              </span>
              {isAuthenticated && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-slate-500 block truncate font-medium">
              {contactSubtitle}
            </span>
            <span className="text-[10px] text-indigo-600 font-bold block mt-0.5 group-hover:underline">
              My Profile →
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* ========================================================
          3. SCROLLABLE NAVIGATION SECTIONS
         ======================================================== */}
      <div className="flex-1 px-3 py-4 space-y-5">
        {/* MAIN NAVIGATION */}
        <div>
          <div className="px-3 mb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Main Navigation
            </span>
          </div>

          <nav className="space-y-0.5">
            {/* 🏠 Home */}
            <button
              type="button"
              id="drawer-nav-home"
              onClick={() => {
                onSelectHome();
                if (isMobile) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'catalog'
                  ? 'bg-indigo-50 text-indigo-700 font-black shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-indigo-600" />
                <span>Home</span>
              </div>
            </button>

            {/* 👤 Profile */}
            <button
              type="button"
              id="drawer-nav-profile"
              onClick={() => {
                onOpenProfile();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-600" />
                <span>Profile</span>
              </div>
            </button>

            {/* 📋 My Bookings */}
            <button
              type="button"
              id="drawer-nav-bookings"
              onClick={() => {
                onSelectBookings();
                if (isMobile) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'bookings'
                  ? 'bg-emerald-50 text-emerald-900 font-black shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>My Bookings</span>
              </div>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* 🛒 Cart */}
            <button
              type="button"
              id="drawer-nav-cart"
              onClick={() => {
                onOpenCart();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                <span>Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 💳 Wallet */}
            <button
              type="button"
              id="drawer-nav-wallet"
              onClick={() => {
                onOpenWallet();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-teal-600" />
                <span>Wallet</span>
              </div>
            </button>

            {/* ⭐ My Subscription */}
            <button
              type="button"
              id="drawer-nav-subscription"
              onClick={() => {
                onOpenSubscription();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-purple-600" />
                <span>My Subscription</span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xs">
                <Sparkles className="w-2.5 h-2.5" />
                PLUS
              </span>
            </button>
          </nav>
        </div>

        {/* DIVIDER */}
        <hr className="border-slate-100" />

        {/* SERVICES */}
        <div>
          <div className="px-3 mb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Services
            </span>
          </div>

          <nav className="space-y-0.5">
            {/* 🔧 All Services */}
            <button
              type="button"
              id="drawer-nav-all-services"
              onClick={() => {
                onSelectAllServices();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-sky-600" />
                <span>All Services</span>
              </div>
            </button>

            {/* 📂 Categories */}
            <button
              type="button"
              id="drawer-nav-categories"
              onClick={() => {
                onSelectCategories();
                if (isMobile) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'categories'
                  ? 'bg-indigo-50 text-indigo-700 font-black shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4 text-indigo-600" />
                <span>Categories</span>
              </div>
            </button>

            {/* 🔍 Search Services */}
            <button
              type="button"
              id="drawer-nav-search-services"
              onClick={() => {
                onOpenSearch();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-600" />
                <span>Search Services</span>
              </div>
            </button>
          </nav>
        </div>

        {/* DIVIDER */}
        <hr className="border-slate-100" />

        {/* LOCATION & SUPPORT */}
        <div>
          <div className="px-3 mb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Location & Support
            </span>
          </div>

          <nav className="space-y-0.5">
            {/* 📍 Bhubaneswar GPS Live */}
            <button
              type="button"
              id="drawer-nav-location-gps"
              onClick={() => {
                onOpenLocation();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>{cityName} GPS Live</span>
              </div>
              {isGpsLive && (
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-black">
                  LIVE
                </span>
              )}
            </button>

            {/* 🔔 Notifications */}
            <button
              type="button"
              id="drawer-nav-notifications"
              onClick={() => {
                onOpenNotifications();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* 🎧 Customer Support */}
            <button
              type="button"
              id="drawer-nav-support"
              onClick={() => {
                onOpenSupport();
                if (isMobile) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'support'
                  ? 'bg-indigo-50 text-indigo-700 font-black shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Headphones className="w-4 h-4 text-indigo-600" />
                <span>Customer Support</span>
              </div>
            </button>

            {/* ❓ Help & FAQ */}
            <button
              type="button"
              id="drawer-nav-faq"
              onClick={() => {
                onOpenFaq();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>Help & FAQ</span>
              </div>
            </button>

            {/* ⚠️ Complaints & Issues */}
            <button
              type="button"
              id="drawer-nav-complaints"
              onClick={() => {
                onOpenComplaints();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Complaints & Issues</span>
              </div>
            </button>
          </nav>
        </div>

        {/* DIVIDER */}
        <hr className="border-slate-100" />

        {/* ACCOUNT */}
        <div>
          <div className="px-3 mb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Account
            </span>
          </div>

          <nav className="space-y-0.5">
            {/* ⚙️ Settings */}
            <button
              type="button"
              id="drawer-nav-settings"
              onClick={() => {
                onOpenSettings();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Settings</span>
              </div>
            </button>

            {/* 🚪 Logout */}
            <button
              type="button"
              id="drawer-nav-logout"
              onClick={() => {
                onLogout();
                if (isMobile) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Logout</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* FOOTER BADGE */}
      <div className="p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
        <span>Doorbly Customer App • Odisha</span>
      </div>
    </div>
  );

  // If mobile drawer: wrap in motion.div with backdrop
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              id="mobile-drawer-backdrop"
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Slide Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              id="mobile-navigation-drawer"
              className="relative w-[300px] max-w-[85vw] h-full shadow-2xl z-10"
            >
              {drawerContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Collapsible Left Sidebar:
  // Main app content resizes automatically when sidebar opens or closes
  if (!isOpen) return null;

  return (
    <aside
      id="desktop-navigation-sidebar"
      aria-label="Doorbly Main Navigator"
      className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-200/90 shadow-2xs z-20 transition-all duration-300"
    >
      {drawerContent}
    </aside>
  );
};
