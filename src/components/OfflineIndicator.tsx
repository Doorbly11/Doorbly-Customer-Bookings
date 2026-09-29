import React from 'react';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 flex items-center gap-3 rounded-xl bg-amber-600 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-bounce">
      <WifiOff className="w-5 h-5 shrink-0" />
      <div>
        <p className="font-semibold text-xs tracking-wider uppercase text-amber-200">Offline Mode</p>
        <p className="text-xs">Using cached catalog data. Bookings will sync when back online.</p>
      </div>
    </div>
  );
};
