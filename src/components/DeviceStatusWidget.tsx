import React from 'react';
import { RealNetworkStatus } from '../lib/useDeviceStatus';
import { WifiOff } from 'lucide-react';

interface DeviceStatusWidgetProps {
  networkStatus: RealNetworkStatus;
}

export const DeviceStatusWidget: React.FC<DeviceStatusWidgetProps> = ({ networkStatus }) => {
  if (networkStatus.isOnline) {
    return null;
  }

  return (
    <div
      id="offline-status-banner"
      className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-50 sticky top-0 animate-in slide-in-from-top duration-200"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-center">
        <WifiOff className="w-4 h-4 animate-bounce shrink-0" />
        <span>Device is Offline: Internet connection lost. Some live booking updates may be queued locally.</span>
      </div>
    </div>
  );
};
