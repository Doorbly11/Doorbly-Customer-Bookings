import React, { useState, useEffect } from 'react';
import { CustomerProfile, Booking } from '../types';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Truck, 
  UserCheck, 
  MapPin, 
  CreditCard, 
  Crown, 
  AlertTriangle,
  Trash2
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'booking' | 'partner' | 'arrival' | 'payment' | 'subscription' | 'support';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: CustomerProfile;
  bookings?: Booking[];
  onSelectBooking?: (booking: Booking) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  bookings = [],
  onSelectBooking
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    // Generate real notifications based strictly on authentic booking events and tickets
    const items: NotificationItem[] = [];

    bookings.forEach((b) => {
      // 1. Booking confirmation
      if (b.booking_status) {
        items.push({
          id: `notif-booked-${b.id}`,
          type: 'booking',
          title: `Booking Confirmed: ${b.booking_reference}`,
          message: `Your booking for ${b.items?.[0]?.service_name_snapshot || 'doorstep service'} is scheduled on ${b.scheduled_date} at ${b.scheduled_start_time}.`,
          timestamp: b.created_at || new Date().toISOString(),
          read: true
        });
      }

      // 2. Partner Assignment
      if (['assigned', 'partner_on_the_way', 'partner_arrived', 'in_progress', 'completed'].includes(b.booking_status)) {
        items.push({
          id: `notif-assigned-${b.id}`,
          type: 'partner',
          title: `Partner Assigned: ${b.booking_reference}`,
          message: `A verified technician has been allocated to your service address in ${b.service_address?.city || 'Odisha'}.`,
          timestamp: b.created_at || new Date().toISOString(),
          read: true
        });
      }

      // 3. Partner Arrival
      if (['partner_arrived', 'in_progress', 'completed'].includes(b.booking_status)) {
        items.push({
          id: `notif-arrived-${b.id}`,
          type: 'arrival',
          title: `Partner Arrived: ${b.booking_reference}`,
          message: `Technician has checked in at your doorstep. Please share OTP upon completion.`,
          timestamp: b.created_at || new Date().toISOString(),
          read: true
        });
      }
    });

    // Check if subscription active
    const savedSub = localStorage.getItem('doorbly_subscription_data');
    if (savedSub) {
      try {
        const sub = JSON.parse(savedSub);
        if (sub.isActive) {
          items.push({
            id: 'notif-sub',
            type: 'subscription',
            title: `Active Membership: ${sub.planName}`,
            message: `Your Doorbly Plus benefits are active with ${sub.discountPercentage}% flat off all hourly trades.`,
            timestamp: sub.startDate || new Date().toISOString(),
            read: true
          });
        }
      } catch (e) {}
    }

    // Sort by timestamp descending
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  // Re-sync when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      const items: NotificationItem[] = [];

      bookings.forEach((b) => {
        items.push({
          id: `notif-booked-${b.id}`,
          type: 'booking',
          title: `Booking Confirmed: ${b.booking_reference}`,
          message: `Your booking for ${b.items?.[0]?.service_name_snapshot || 'doorstep service'} is scheduled on ${b.scheduled_date} at ${b.scheduled_start_time}.`,
          timestamp: b.created_at || new Date().toISOString(),
          read: true
        });

        if (['assigned', 'partner_on_the_way', 'partner_arrived', 'in_progress', 'completed'].includes(b.booking_status)) {
          items.push({
            id: `notif-assigned-${b.id}`,
            type: 'partner',
            title: `Partner Assigned: ${b.booking_reference}`,
            message: `Verified technician allocated for booking ${b.booking_reference}.`,
            timestamp: b.created_at || new Date().toISOString(),
            read: true
          });
        }

        if (['partner_arrived', 'in_progress', 'completed'].includes(b.booking_status)) {
          items.push({
            id: `notif-arrived-${b.id}`,
            type: 'arrival',
            title: `Partner Arrived: ${b.booking_reference}`,
            message: `Technician has arrived at doorstep for booking ${b.booking_reference}.`,
            timestamp: b.created_at || new Date().toISOString(),
            read: true
          });
        }
      });

      setNotifications(items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  }, [bookings]);

  if (!isOpen) return null;

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'partner':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      case 'arrival':
        return <MapPin className="w-4 h-4 text-teal-600" />;
      case 'subscription':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'support':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="notifications-modal-card"
        className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Notifications
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Live service & account updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                No notifications
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                You're all caught up! Updates regarding your doorstep bookings, technician arrivals, and support tickets will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-all text-xs space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <span className="font-extrabold text-slate-900 truncate flex-1">
                      {notif.title}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed pl-8">
                    {notif.message}
                  </p>
                  <div className="pl-8 pt-1 text-[10px] text-slate-400">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
