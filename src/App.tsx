import React, { useEffect, useState, useCallback } from 'react';
import { Booking, CustomerAddress, CustomerProfile, Service, CartItem } from './types';
import { DEFAULT_ODISHA_LOCATION } from './data/odishaLocations';
import { fetchCustomerBookings } from './lib/supabase';
import { useDeviceStatus } from './lib/useDeviceStatus';
import { isAdminLoggedIn } from './lib/adminStore';
import { DeviceStatusWidget } from './components/DeviceStatusWidget';
import { Navbar } from './components/Navbar';
import { ServiceCatalogView } from './components/ServiceCatalogView';
import { MyBookingsView } from './components/MyBookingsView';
import { HelpSupportView } from './components/HelpSupportView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OdishaLocationModal } from './components/OdishaLocationModal';
import { BookingModal } from './components/BookingModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CartModal } from './components/CartModal';
import { WalletModal } from './components/WalletModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ExploreCategoriesPage } from './components/ExploreCategoriesPage';
import { AllServicesView } from './components/AllServicesView';
import { AppSidebar } from './components/AppSidebar';
import { ResponsiveBottomNav } from './components/ResponsiveBottomNav';
import { ComplaintsModal } from './components/ComplaintsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { SearchServicesModal } from './components/SearchServicesModal';
import { PlayStoreCenterModal } from './components/PlayStoreCenterModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { fetchServices } from './lib/supabase';
import { CATEGORIES_MASTER } from './data/serviceCatalogMaster';
import { CheckCircle2, ShieldCheck, Heart, Sparkles, Shield, Lock, Phone, Mail, ShoppingCart, Smartphone, Download } from 'lucide-react';

export default function App() {
  // Navigation State & History
  const [activeView, setActiveView] = useState<'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin'>('catalog');
  const [viewHistory, setViewHistory] = useState<('catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin')[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const navigateTo = (view: 'catalog' | 'services' | 'categories' | 'bookings' | 'support' | 'admin') => {
    if (view !== activeView) {
      setViewHistory(prev => [...prev, activeView]);
      setActiveView(view);
    }
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn()) {
      navigateTo('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  // Shortcut key (Ctrl + Alt + A or Cmd + Option + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGoBack = () => {
    if (selectedCategoryFilter !== 'all' && activeView === 'catalog') {
      setSelectedCategoryFilter('all');
      return;
    }
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(history => history.slice(0, -1));
      setActiveView(prev);
    } else {
      setActiveView('catalog');
      setSelectedCategoryFilter('all');
    }
  };

  // Customer Profile State (persisted in localStorage)
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('doorbly_customer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.full_name && parsed.full_name !== 'Debabrata Mohapatra') {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      id: 'cust-guest',
      full_name: '',
      email: '',
      phone: '',
      is_logged_in: false
    };
  });

  // Customer Address State (persisted in localStorage)
  const [currentAddress, setCurrentAddress] = useState<CustomerAddress>(() => {
    const saved = localStorage.getItem('doorbly_customer_address');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      address_line: 'Plot No. 124, Saheed Nagar',
      area: 'Saheed Nagar',
      city: 'Bhubaneswar',
      district: 'Khordha',
      state: 'Odisha',
      pincode: '751007',
      is_default: true
    };
  });

  const handleUpdateAddress = useCallback((newAddr: CustomerAddress) => {
    setCurrentAddress(newAddr);
    localStorage.setItem('doorbly_customer_address', JSON.stringify(newAddr));
  }, []);

  // Real-Time Device Location & Network Status Hook
  const {
    networkStatus,
    locationStatus,
    fetchRealLocation,
    startLiveWatch,
    stopLiveWatch
  } = useDeviceStatus(handleUpdateAddress);

  // Modal States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [serviceToBook, setServiceToBook] = useState<Service | null>(null);

  // Cart, Wallet & Subscription Modals State
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);

  // Customer Navigation Drawer & Service Issue Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState<boolean>(false);
  const [isComplaintsModalOpen, setIsComplaintsModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);

  // Pre-load all services for fast search modal
  useEffect(() => {
    fetchServices().then(res => {
      if (res && res.length > 0) {
        setAllServices(res);
      }
    }).catch(() => {});
  }, []);

  // Global shortcut (Ctrl + K or Cmd + K) for Quick Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cart State (persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('doorbly_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('doorbly_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (service: Service) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.service.id === service.id);
      if (exists) {
        return prev.map(i => i.service.id === service.id ? { ...i, hours: i.hours + 1 } : i);
      }
      return [...prev, { service, hours: 1 }];
    });
    setNotificationToast(`Added ${service.name} to cart!`);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handleUpdateCartHours = (serviceId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(i => {
          if (i.service.id === serviceId) {
            const newHours = i.hours + delta;
            return newHours > 0 ? { ...i, hours: newHours } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCartItems(prev => prev.filter(i => i.service.id !== serviceId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartModalOpen(false);
    if (cartItems.length > 0) {
      setServiceToBook(cartItems[0].service);
    }
  };

  // Active bookings tracker
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const refreshBookingCount = async () => {
    try {
      const bookings = await fetchCustomerBookings(customerProfile.id);
      setCustomerBookings(bookings);
      const active = bookings.filter(b => !['completed', 'cancelled', 'rejected'].includes(b.booking_status));
      setActiveBookingsCount(active.length);
    } catch (e) {}
  };

  useEffect(() => {
    refreshBookingCount();
  }, [customerProfile.id]);

  const handleUpdateProfile = (newProfile: CustomerProfile) => {
    setCustomerProfile(newProfile);
    localStorage.setItem('doorbly_customer_profile', JSON.stringify(newProfile));
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('doorbly_customer_profile');
    setCustomerProfile({
      id: 'cust-guest',
      full_name: '',
      email: '',
      phone: '',
      is_logged_in: false
    });
  };

  const handleBookingSuccess = (booking: Booking) => {
    setNotificationToast(`Booking ${booking.booking_reference} placed successfully! Tracking partner dispatch...`);
    refreshBookingCount();
    navigateTo('bookings');
    setTimeout(() => {
      setNotificationToast(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Offline Alert Banner (shown only when disconnected) */}
      <DeviceStatusWidget networkStatus={networkStatus} />

      {/* Toast notification */}
      {notificationToast && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 animate-in slide-in-from-top-3 duration-200 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{notificationToast}</span>
        </div>
      )}

      {/* App Shell with Left-Hand Side Menu Bar integrated for every mode */}
      <div className="flex-1 flex min-h-screen w-full">
        {/* Left-Hand Side Menu Bar (Desktop persistent sidebar & Mobile slide drawer) */}
        <AppSidebar
          activeView={activeView}
          onSelectView={(v) => {
            navigateTo(v);
          }}
          currentAddress={currentAddress}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onAutoDetectLocation={() => fetchRealLocation(true)}
          locationStatus={locationStatus}
          customerProfile={customerProfile}
          activeBookingsCount={activeBookingsCount}
          cartCount={cartItems.reduce((acc, item) => acc + item.hours, 0)}
          unreadNotificationsCount={customerBookings.filter(b => !['completed', 'cancelled'].includes(b.booking_status)).length}
          onOpenProfile={() => setIsAuthModalOpen(true)}
          onOpenCart={() => setIsCartModalOpen(true)}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenAdminModal={handleOpenAdmin}
          onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
          isMobileOpen={isDrawerOpen}
          onCloseMobile={() => setIsDrawerOpen(false)}
        />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 w-full bg-slate-50 pb-16 md:pb-0">
          {/* Main Header - Logo & Company Name with responsive menu toggle */}
          <Navbar
            activeView={activeView}
            onSelectView={(v) => {
              navigateTo(v);
            }}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
          />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'catalog' && (
          <ServiceCatalogView
            currentAddress={currentAddress}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onAutoDetectLocation={() => fetchRealLocation(true)}
            isLocating={locationStatus.isLocating}
            onSelectServiceToBook={(service) => setServiceToBook(service)}
            onAddToCart={handleAddToCart}
            initialCategorySlug={selectedCategoryFilter}
            onOpenCategoriesPage={() => navigateTo('categories')}
            onOpenServicesPage={() => navigateTo('services')}
            customerProfile={customerProfile}
            onOpenProfile={() => setIsAuthModalOpen(true)}
            onSelectBookings={() => navigateTo('bookings')}
            onOpenCart={() => setIsCartModalOpen(true)}
            onOpenWallet={() => setIsWalletModalOpen(true)}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
            cartCount={cartItems.reduce((acc, item) => acc + item.hours, 0)}
            activeBookingsCount={activeBookingsCount}
          />
        )}

        {activeView === 'services' && (
          <AllServicesView
            onSelectServiceToBook={(service) => setServiceToBook(service)}
            onAddToCart={handleAddToCart}
            initialCategorySlug={selectedCategoryFilter}
            onGoBack={() => navigateTo('catalog')}
            currentAddress={currentAddress}
            onOpenCategoriesPage={() => navigateTo('categories')}
          />
        )}

        {activeView === 'categories' && (
          <ExploreCategoriesPage
            onSelectCategory={(slug) => {
              setSelectedCategoryFilter(slug);
              navigateTo('services');
            }}
            onGoBack={() => navigateTo('catalog')}
          />
        )}

        {activeView === 'bookings' && (
          <MyBookingsView
            customerId={customerProfile.id}
            customerProfile={customerProfile}
            onExploreServices={() => {
              setSelectedCategoryFilter('all');
              navigateTo('catalog');
            }}
            onGoBack={handleGoBack}
          />
        )}

        {activeView === 'support' && (
          <HelpSupportView
            onExploreServices={() => {
              setSelectedCategoryFilter('all');
              navigateTo('catalog');
            }}
            onGoBack={handleGoBack}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanel
            onCloseAdmin={() => navigateTo('catalog')}
            onSelectCustomerView={() => navigateTo('catalog')}
            onGoBack={() => navigateTo('catalog')}
          />
        )}
      </main>

      {/* Floating Cart Pill when items are added */}
      {cartItems.length > 0 && (
        <button
          id="btn-floating-cart"
          onClick={() => setIsCartModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 cursor-pointer transition-all border border-emerald-400/50"
          title="View Doorstep Cart"
        >
          <ShoppingCart className="w-5 h-5 text-white" />
          <span className="text-xs font-bold">Cart</span>
          <span className="bg-white text-emerald-700 text-xs font-black px-2 py-0.5 rounded-full">
            {cartItems.reduce((acc, item) => acc + item.hours, 0)}
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  D
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-xl font-['Outfit']">
                  DOORBLY
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Odisha's premier hourly doorstep marketplace. Connecting households and businesses with verified electricians, technicians, carpenters, tutors, and cleaners across all 30 districts of Odisha.
              </p>
              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent Hourly Billing • Verified Trade Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Customer Helpline: </span>
                  <a href="tel:9938713179" className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">
                    +91 99387 13179
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Email Support: </span>
                  <a href="mailto:support@doorbly.com" className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">
                    support@doorbly.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
                Odisha District Hubs
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="hover:text-slate-900 transition-colors">Bhubaneswar (Khordha)</li>
                <li className="hover:text-slate-900 transition-colors">Cuttack Millennium City</li>
                <li className="hover:text-slate-900 transition-colors">Puri & Konark Region</li>
                <li className="hover:text-slate-900 transition-colors">Rourkela (Sundargarh)</li>
                <li className="hover:text-slate-900 transition-colors">Berhampur & Ganjam</li>
                <li className="hover:text-slate-900 transition-colors">Sambalpur & Balasore</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
                Platform Information
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>
                  <button
                    onClick={() => navigateTo('services')}
                    className="hover:text-emerald-700 font-medium cursor-pointer transition-colors"
                  >
                    All 978+ Services Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('categories')}
                    className="hover:text-emerald-700 font-medium cursor-pointer transition-colors"
                  >
                    50 Trade Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="hover:text-emerald-700 font-medium cursor-pointer transition-colors"
                  >
                    Odisha Operating Zones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('support')}
                    className="hover:text-emerald-700 font-medium cursor-pointer transition-colors"
                  >
                    Customer Support & FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPlayStoreModalOpen(true)}
                    className="hover:text-emerald-700 font-medium cursor-pointer transition-colors flex items-center gap-1.5 text-indigo-700 font-semibold"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Android & Play Store Hub</span>
                  </button>
                </li>
                <li>
                  <a
                    href="/doorbly.apk"
                    download="doorbly.apk"
                    className="hover:text-emerald-700 font-medium cursor-pointer transition-colors flex items-center gap-1.5 text-emerald-700 font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Download APK (Direct Mobile Install)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div 
              onDoubleClick={handleOpenAdmin}
              className="cursor-default select-none"
              title="Doorbly Technologies"
            >
              © {new Date().getFullYear()} Doorbly Technologies Pvt Ltd. All rights reserved.
            </div>
          </div>
        </div>
          </footer>
        </div>
      </div>

      {/* Responsive Mode Menu Bar Navigator (Mobile Bottom Nav) */}
      <ResponsiveBottomNav
        activeView={activeView}
        onSelectView={(v) => {
          navigateTo(v);
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.hours, 0)}
        activeBookingsCount={activeBookingsCount}
        onOpenCart={() => setIsCartModalOpen(true)}
        onOpenWallet={() => setIsWalletModalOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenProfile={() => setIsAuthModalOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={() => {
          navigateTo('admin');
        }}
      />
      <OdishaLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={handleUpdateAddress}
      />

      <BookingModal
        isOpen={!!serviceToBook}
        onClose={() => setServiceToBook(null)}
        service={serviceToBook}
        customerProfile={customerProfile}
        currentAddress={currentAddress}
        onBookingSuccess={handleBookingSuccess}
        onProfileUpdated={handleUpdateProfile}
      />

      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        customerProfile={customerProfile}
        onProfileUpdated={handleUpdateProfile}
        onLogout={handleCustomerLogout}
        onAdminLogin={() => navigateTo('admin')}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onUpdateHours={handleUpdateCartHours}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        customerProfile={customerProfile}
        currentAddress={currentAddress}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onExploreServices={() => {
          setSelectedCategoryFilter('all');
          navigateTo('catalog');
        }}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        customerProfile={customerProfile}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        customerProfile={customerProfile}
        onSubscriptionChange={() => {
          setNotificationToast('Membership status updated!');
          setTimeout(() => setNotificationToast(null), 3000);
        }}
      />

      {/* Complaints / Service Grievance Modal */}
      <ComplaintsModal
        isOpen={isComplaintsModalOpen}
        onClose={() => setIsComplaintsModalOpen(false)}
        customerProfile={customerProfile}
        bookings={customerBookings}
        onOpenBookingDetails={() => {
          setIsComplaintsModalOpen(false);
          navigateTo('bookings');
        }}
      />

      {/* Live Customer Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        customerProfile={customerProfile}
        bookings={customerBookings}
        onSelectBooking={() => {
          setIsNotificationsModalOpen(false);
          navigateTo('bookings');
        }}
      />

      {/* Settings Modal (Language Odia/English, SMS/WhatsApp alerts, permissions) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        customerProfile={customerProfile}
        currentAddress={currentAddress}
        locationStatus={locationStatus}
        onOpenProfile={() => {
          setIsSettingsModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        onRequestLocationPermission={() => fetchRealLocation(true)}
        onLogout={handleCustomerLogout}
      />

      {/* Fast Global Search Modal across 50+ trades */}
      <SearchServicesModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        services={allServices}
        onSelectService={(service) => {
          setIsSearchModalOpen(false);
          setServiceToBook(service);
        }}
        onAddToCart={(service) => {
          handleAddToCart(service);
        }}
      />

      {/* Android Play Store Hub Modal */}
      <PlayStoreCenterModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
}

