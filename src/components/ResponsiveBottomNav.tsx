import React from 'react';
import {
  Home,
  LayoutGrid,
  Layers,
  CalendarCheck,
  ShoppingCart,
  Wallet,
  Crown,
  User,
  Menu
} from 'lucide-react';

interface ResponsiveBottomNavProps {
  activeView: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin';
  onSelectView: (view: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin') => void;
  cartCount?: number;
  activeBookingsCount?: number;
  onOpenCart: () => void;
  onOpenWallet: () => void;
  onOpenSubscription: () => void;
  onOpenProfile: () => void;
  onOpenDrawer: () => void;
}

export const ResponsiveBottomNav: React.FC<ResponsiveBottomNavProps> = ({
  activeView,
  onSelectView,
  cartCount = 0,
  activeBookingsCount = 0,
  onOpenCart,
  onOpenWallet,
  onOpenSubscription,
  onOpenProfile,
  onOpenDrawer,
}) => {
  return (
    <nav
      id="responsive-bottom-navigator"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          id="btn-bottom-nav-home"
          type="button"
          onClick={() => onSelectView('catalog')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] ${
            activeView === 'catalog'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-600 hover:text-emerald-700'
          }`}
          title="Home & Offers"
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeView === 'catalog' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Home</span>
        </button>

        {/* 2. Services */}
        <button
          id="btn-bottom-nav-services"
          type="button"
          onClick={() => onSelectView('services')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] ${
            activeView === 'services'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-600 hover:text-emerald-700'
          }`}
          title="All Services"
        >
          <div className="relative">
            <LayoutGrid className={`w-5 h-5 ${activeView === 'services' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Services</span>
        </button>

        {/* 3. Categories */}
        <button
          id="btn-bottom-nav-categories"
          type="button"
          onClick={() => onSelectView('categories')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] ${
            activeView === 'categories'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-600 hover:text-emerald-700'
          }`}
          title="Categories Hub"
        >
          <div className="relative">
            <Layers className={`w-5 h-5 ${activeView === 'categories' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Categories</span>
        </button>

        {/* 3. Bookings */}
        <button
          id="btn-bottom-nav-bookings"
          type="button"
          onClick={() => onSelectView('bookings')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] relative ${
            activeView === 'bookings'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-600 hover:text-indigo-600'
          }`}
          title="My Bookings"
        >
          <div className="relative">
            <CalendarCheck className={`w-5 h-5 ${activeView === 'bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-indigo-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
                {activeBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Bookings</span>
        </button>

        {/* 4. Cart */}
        <button
          id="btn-bottom-nav-cart"
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] text-slate-600 hover:text-emerald-600 active:scale-95 relative"
          title="My Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-emerald-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Cart</span>
        </button>

        {/* 5. Wallet */}
        <button
          id="btn-bottom-nav-wallet"
          type="button"
          onClick={onOpenWallet}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] text-slate-600 hover:text-emerald-600 active:scale-95"
          title="Wallet"
        >
          <div className="relative">
            <Wallet className="w-5 h-5 stroke-2" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Wallet</span>
        </button>

        {/* 6. Full Menu Drawer Trigger (Profile, VIP, Settings, All 50+ Trades) */}
        <button
          id="btn-bottom-nav-menu"
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] text-slate-700 hover:text-indigo-600 active:scale-95"
          title="Full Menu"
        >
          <div className="relative p-0.5 bg-slate-100 rounded-lg group-hover:bg-indigo-50">
            <Menu className="w-4 h-4 text-slate-700" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5 whitespace-nowrap">Menu</span>
        </button>
      </div>
    </nav>
  );
};
