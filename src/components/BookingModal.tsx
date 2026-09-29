import React, { useState, useEffect } from 'react';
import { Booking, CustomerAddress, CustomerProfile, Service, ProviderAvailabilityResult } from '../types';
import { createBooking, calculateAuthoritativeTax, checkRealProviderAvailability, syncCustomerProfile } from '../lib/supabase';
import { getTechnicianVisual } from '../data/technicianVisuals';
import { VfxCard } from './VfxCard';
import { Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, X, AlertCircle, Sparkles, UserCheck, User, Phone, Mail } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  customerProfile: CustomerProfile;
  currentAddress: CustomerAddress;
  onBookingSuccess: (booking: Booking) => void;
  onProfileUpdated?: (profile: CustomerProfile) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  customerProfile,
  currentAddress,
  onBookingSuccess,
  onProfileUpdated
}) => {
  if (!isOpen || !service) return null;

  const today = new Date().toISOString().split('T')[0];
  const [scheduledDate, setScheduledDate] = useState<string>(today);
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 12:00 PM');
  const [hours, setHours] = useState<number>(service.minimum_hours || 1);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customer Contact State (if not already logged in)
  const [custName, setCustName] = useState<string>(customerProfile.full_name || '');
  const [custPhone, setCustPhone] = useState<string>(customerProfile.phone || '');
  const [custEmail, setCustEmail] = useState<string>(customerProfile.email || '');

  // Tax and Availability state
  const [taxState, setTaxState] = useState<{
    taxPercentage: number;
    taxAmount: number;
    grandTotal: number;
  }>({ taxPercentage: 18, taxAmount: 0, grandTotal: 0 });

  const [availability, setAvailability] = useState<ProviderAvailabilityResult>({
    isAvailable: true,
    message: `Checking technician availability in ${currentAddress.district || 'Khordha'}, Odisha...`
  });

  const pricePerHour = service.customer_price ?? service.customer_hourly_price;
  const subtotal = pricePerHour * hours;

  // Recalculate dynamic taxes
  useEffect(() => {
    let isMounted = true;
    calculateAuthoritativeTax(subtotal).then(res => {
      if (isMounted) {
        setTaxState({
          taxPercentage: res.taxPercentage,
          taxAmount: res.taxAmount,
          grandTotal: res.grandTotal
        });
      }
    });
    return () => { isMounted = false; };
  }, [subtotal]);

  // Check partner availability
  useEffect(() => {
    let isMounted = true;
    checkRealProviderAvailability({
      serviceId: service.id,
      categorySlug: service.category_slug,
      district: currentAddress.district || 'Khordha',
      scheduledDate,
      scheduledTime: timeSlot
    }).then(res => {
      if (isMounted) setAvailability(res);
    });
    return () => { isMounted = false; };
  }, [service.id, currentAddress.district, scheduledDate, timeSlot]);

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  const handleHourChange = (delta: number) => {
    const newHours = hours + delta;
    if (newHours >= (service.minimum_hours || 1) && newHours <= (service.maximum_hours || 8)) {
      setHours(newHours);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const finalName = custName.trim() || customerProfile.full_name?.trim();
    const finalPhone = custPhone.trim() || customerProfile.phone?.trim();
    const finalEmail = custEmail.trim() || customerProfile.email?.trim();

    if (!finalName) {
      setErrorMsg("Please provide your full name for technician dispatch.");
      setIsSubmitting(false);
      return;
    }
    if (!finalPhone) {
      setErrorMsg("Please provide a valid contact mobile number.");
      setIsSubmitting(false);
      return;
    }
    if (!finalEmail) {
      setErrorMsg("Please enter your email to receive your tax invoice.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Sync customer profile
      const updatedProfile: CustomerProfile = {
        ...customerProfile,
        full_name: finalName,
        phone: finalPhone,
        email: finalEmail,
        is_logged_in: true
      };

      const synced = await syncCustomerProfile(updatedProfile);
      if (onProfileUpdated) {
        onProfileUpdated(synced);
      }

      const newBooking = await createBooking({
        customerId: synced.id,
        customerName: finalName,
        customerPhone: finalPhone,
        customerEmail: finalEmail,
        service: service,
        address: currentAddress,
        scheduledDate,
        scheduledStartTime: timeSlot,
        hours,
        notes
      });

      setIsSubmitting(false);
      onBookingSuccess(newBooking);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to submit booking. Please check details and try again.');
    }
  };

  const techVisual = getTechnicianVisual(service.category_slug || 'home-repair-maintenance', service.slug);
  const displayImg = service.image_url || techVisual.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          id="btn-close-booking-modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Book Hourly Service</h2>
            <p className="text-xs text-slate-500 font-medium">Verified Doorstep Service in {currentAddress.city}, Odisha</p>
          </div>
        </div>

        {/* Service Summary Card */}
        <div className="mb-4">
          <VfxCard glowColor="emerald" className="group">
            <div className="relative bg-white p-4 overflow-hidden w-full transition-colors duration-200">
              <div className="relative z-10 flex gap-3.5 items-center">
                <img
                  src={displayImg}
                  alt={service.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200/80 shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${techVisual.pillBg} ${techVisual.pillText} border ${techVisual.pillBorder} px-2 py-0.5 rounded-md`}>
                          {service.category_name}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          {techVisual.badgeLabel}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate card-title group-hover:text-emerald-700 transition-colors">{service.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate card-subtext">{techVisual.tradeRole}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base text-slate-900 font-mono font-bold card-price group-hover:text-emerald-700 transition-all inline-block">
                        ₹{Number.isInteger(pricePerHour) ? pricePerHour : pricePerHour.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal block card-subtext">/ hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VfxCard>
        </div>

        {/* Partner Availability Alert */}
        <div className={`mb-4 p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
          availability.isAvailable
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {availability.isAvailable ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="font-medium">{availability.message}</span>
        </div>

        <form onSubmit={handleConfirmBooking} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Genuine Customer Contact Information */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Customer Contact Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                required
                className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="tel"
                placeholder="Mobile Number (+91)"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                required
                className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address (for official GST invoice)"
              value={custEmail}
              onChange={(e) => setCustEmail(e.target.value)}
              required
              className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Duration in Hours */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours)</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleHourChange(-1)}
                disabled={hours <= (service.minimum_hours || 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40 cursor-pointer"
              >
                -
              </button>
              <div className="w-16 text-center font-mono font-bold text-base text-slate-900">
                {hours} {hours === 1 ? 'hr' : 'hrs'}
              </div>
              <button
                type="button"
                onClick={() => handleHourChange(1)}
                disabled={hours >= (service.maximum_hours || 8)}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-40 cursor-pointer"
              >
                +
              </button>
              <span className="text-xs text-slate-400">
                (Min: {service.minimum_hours || 1} hr, Max: {service.maximum_hours || 8} hrs)
              </span>
            </div>
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Service Date
              </label>
              <input
                type="date"
                min={today}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Doorstep Location */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Doorstep Location</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {currentAddress.address_line}, {currentAddress.area}, {currentAddress.city} ({currentAddress.district} Dist.), PIN: {currentAddress.pincode}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Notes for Technician</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call 10 mins before arrival..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 resize-none"
            />
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Service Fee ({hours} hrs @ ₹{pricePerHour}/hr):</span>
              <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>GST ({taxState.taxPercentage}% - CGST 9% + SGST 9%):</span>
              <span className="font-mono font-semibold">₹{taxState.taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-indigo-200/80 flex justify-between items-center text-sm font-bold text-indigo-950">
              <span>Total Amount</span>
              <span className="text-lg font-extrabold font-mono text-indigo-900">
                ₹{taxState.grandTotal}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="btn-submit-booking-order"
            disabled={isSubmitting || !availability.isAvailable}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Confirming Booking...' : `Confirm & Issue Booking (₹${taxState.grandTotal})`}
          </button>
        </form>
      </div>
    </div>
  );
};
