import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus, CustomerProfile } from '../types';
import { fetchCustomerBookings, subscribeToBookingRealtime, updateBookingStatus } from '../lib/supabase';
import { InvoiceViewModal } from './InvoiceViewModal';
import { VfxCard } from './VfxCard';
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Truck,
  UserCheck,
  PlayCircle,
  Receipt,
  RotateCw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface MyBookingsViewProps {
  customerId: string;
  onExploreServices: () => void;
  onGoBack?: () => void;
  customerProfile?: CustomerProfile;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  customerId,
  onExploreServices,
  onGoBack,
  customerProfile
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomerBookings(customerId);
      setBookings(data);
      if (data.length > 0 && !selectedBooking) {
        setSelectedBooking(data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [customerId]);

  // Subscribe to realtime updates for the selected booking
  useEffect(() => {
    if (!selectedBooking) return;

    const unsubscribe = subscribeToBookingRealtime(selectedBooking.id, (newStatus) => {
      setSelectedBooking(prev => prev ? { ...prev, booking_status: newStatus } : null);
      setBookings(prev =>
        prev.map(b => (b.id === selectedBooking.id ? { ...b, booking_status: newStatus } : b))
      );
    });

    return () => {
      unsubscribe();
    };
  }, [selectedBooking?.id]);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    await updateBookingStatus(bookingId, 'cancelled');
    loadBookings();
  };

  // Status step progression map
  const statusSteps: { key: BookingStatus; label: string; icon: any }[] = [
    { key: 'pending', label: 'Booking Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'assigned', label: 'Partner Assigned', icon: UserCheck },
    { key: 'partner_on_the_way', label: 'On The Way', icon: Truck },
    { key: 'partner_arrived', label: 'Arrived at Doorstep', icon: MapPin },
    { key: 'in_progress', label: 'Work In Progress', icon: PlayCircle },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 }
  ];

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Partner</span>;
      case 'confirmed':
        return <span className="bg-sky-50 text-sky-800 border border-sky-200/80 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Confirmed</span>;
      case 'assigned':
        return <span className="bg-indigo-50 text-indigo-800 border border-indigo-200/80 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Partner Assigned</span>;
      case 'partner_on_the_way':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200/80 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-purple-600" /> On The Way</span>;
      case 'partner_arrived':
        return <span className="bg-teal-50 text-teal-800 border border-teal-200/80 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-600" /> Arrived at Doorstep</span>;
      case 'in_progress':
        return <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 animate-pulse shadow-xs"><PlayCircle className="w-3.5 h-3.5" /> In Progress</span>;
      case 'completed':
        return <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-800 border border-rose-200/80 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled</span>;
      case 'rejected':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Unavailable</span>;
      default:
        return null;
    }
  };

  // 4 Categorized Booking groups as requested: Upcoming, Ongoing, Completed, Cancelled
  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed', 'assigned'].includes(b.booking_status));
  const ongoingBookings = bookings.filter(b => ['partner_on_the_way', 'partner_arrived', 'in_progress'].includes(b.booking_status));
  const completedBookings = bookings.filter(b => b.booking_status === 'completed');
  const cancelledBookings = bookings.filter(b => ['cancelled', 'rejected'].includes(b.booking_status));

  const displayedList = activeTab === 'all'
    ? bookings
    : activeTab === 'upcoming'
    ? upcomingBookings
    : activeTab === 'ongoing'
    ? ongoingBookings
    : activeTab === 'completed'
    ? completedBookings
    : cancelledBookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Go Back button */}
      {onGoBack && (
        <div className="mb-6">
          <button
            onClick={onGoBack}
            id="btn-goback-bookings"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div
        className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 mb-8 border border-indigo-500/30 shadow-xl shadow-slate-950/40 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 45%, #0f172a 75%, #1e3a8a 100%)'
        }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Real-Time Booking Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Hourly Service Bookings
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl font-normal">
              Track your verified doorstep service partners live across all 30 districts of Odisha.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadBookings}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer hover:border-white/30"
              title="Refresh Bookings"
            >
              <RotateCw className="w-4 h-4 text-indigo-300" />
              <span>Sync Status</span>
            </button>

            <button
              onClick={onExploreServices}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer border border-indigo-400/30"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-2">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
          { id: 'ongoing', label: 'Ongoing', count: ongoingBookings.length },
          { id: 'completed', label: 'Completed', count: completedBookings.length },
          { id: 'cancelled', label: 'Cancelled', count: cancelledBookings.length },
          { id: 'all', label: 'All Bookings', count: bookings.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-black ${
              activeTab === tab.id ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading your Odisha bookings from Supabase...
        </div>
      ) : displayedList.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {activeTab === 'upcoming' 
              ? 'No Upcoming Bookings' 
              : activeTab === 'ongoing'
              ? 'No Ongoing Bookings'
              : activeTab === 'completed'
              ? 'No Completed Bookings'
              : activeTab === 'cancelled'
              ? 'No Cancelled Bookings'
              : 'No bookings yet'}
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {activeTab === 'upcoming' || activeTab === 'ongoing'
              ? 'You have no active appointments scheduled. Browse our 50+ trades catalog to book verified technicians in Odisha.'
              : 'Records will appear here once service bookings are updated in Supabase.'}
          </p>
          <button
            onClick={onExploreServices}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            Explore Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Bookings List */}
          <div className="lg:col-span-5 space-y-3.5">
            {displayedList.map(booking => {
              const isSelected = selectedBooking?.id === booking.id;
              const firstItem = booking.items?.[0];
              return (
                <VfxCard
                  key={booking.id}
                  id={`booking-card-${booking.booking_reference}`}
                  onClick={() => setSelectedBooking(booking)}
                  glowColor="emerald"
                  className={`group active:scale-[0.98] transition-all cursor-pointer ${isSelected ? 'ring-2 ring-emerald-500/50 shadow-md' : ''}`}
                >
                  <div className={`p-4 sm:p-5 relative transition-all bg-white ${
                    isSelected
                      ? 'bg-emerald-50/20'
                      : 'group-hover:bg-slate-50/70'
                  }`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                          {booking.booking_reference || booking.id}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 card-title group-hover:text-emerald-700 transition-colors">
                          {firstItem?.service_name_snapshot || 'Hourly Doorstep Service'}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-900 font-mono card-price group-hover:text-emerald-700 group-hover:scale-105 transition-all origin-right inline-block">
                          ₹{booking.customer_total}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block card-subtext">
                          {booking.total_hours} {booking.total_hours === 1 ? 'hr' : 'hrs'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2.5 text-xs text-slate-600 card-text">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      <span>{booking.scheduled_date}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      <span>{booking.scheduled_start_time}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {getStatusBadge(booking.booking_status)}
                      <span className="text-slate-400 group-hover:text-emerald-700 text-xs font-semibold flex items-center gap-0.5 transition-colors card-action">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </VfxCard>
              );
            })}
          </div>

          {/* Right: Selected Booking Detail & Realtime Tracker */}
          {selectedBooking && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        BOOKING ID: {selectedBooking.booking_reference || selectedBooking.id}
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200">
                        Odisha Zone
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedBooking.items?.[0]?.service_name_snapshot || 'Hourly Doorstep Service'}
                    </h2>
                  </div>
                  <div>
                    {getStatusBadge(selectedBooking.booking_status)}
                  </div>
                </div>

                {/* Real-Time Status Progression Timeline */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Live Service Dispatch Timeline (Realtime)</span>
                  </h3>

                  {selectedBooking.booking_status === 'cancelled' ? (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <strong>This booking was cancelled.</strong> You may create a new booking whenever you need service.
                      </div>
                    </div>
                  ) : selectedBooking.booking_status === 'rejected' ? (
                    <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl text-slate-800 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <strong>No service partner is currently available for this time.</strong> Please reschedule for a different time window.
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {statusSteps.map((step, idx) => {
                        const stepIndex = statusSteps.findIndex(s => s.key === selectedBooking.booking_status);
                        const isDone = stepIndex >= idx;
                        const isCurrent = step.key === selectedBooking.booking_status;
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-xl text-center border transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-300'
                                : isDone
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-[10px] font-bold leading-tight">
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Realtime Testing / Simulation Control */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Simulate Partner Status Change (Live Demo):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['confirmed', 'assigned', 'partner_on_the_way', 'partner_arrived', 'in_progress', 'completed'] as BookingStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => updateBookingStatus(selectedBooking.id, st)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            selectedBooking.booking_status === st
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Appointment & Doorstep Address Details - Interactive Hover Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="group p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 group-hover:text-emerald-700 transition-colors">
                       Scheduled Window
                    </span>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      {selectedBooking.scheduled_date}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      {selectedBooking.scheduled_start_time} ({selectedBooking.total_hours} {selectedBooking.total_hours === 1 ? 'hour' : 'hours'})
                    </div>
                  </div>

                  <div className="group p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 group-hover:text-emerald-700 transition-colors">
                      Doorstep Location
                    </span>
                    <div className="text-xs font-semibold text-slate-800 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span>
                        {selectedBooking.service_address?.address_line || 'Odisha Doorstep Service Address'}
                        <br />
                        {selectedBooking.service_address?.city || 'Odisha'}, PIN: {selectedBooking.service_address?.pincode || '751001'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Safe Invoice Summary - Interactive Hover Card */}
                <div className="group bg-slate-900 hover:bg-slate-950 text-white rounded-2xl p-5 mb-6 shadow-sm hover:shadow-xl hover:shadow-slate-950/40 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                      <Receipt className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>TAX INVOICE ({selectedBooking.invoice_number || 'INV-OD-2026'})</span>
                    </div>
                    <button
                      type="button"
                      id="btn-open-tax-invoice-mybookings"
                      onClick={() => setIsInvoiceOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 px-3 py-1 rounded-lg border border-emerald-500/40 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View / Print Invoice</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {selectedBooking.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-300">
                        <span>
                          {item.service_name_snapshot} ({item.hours} {item.hours === 1 ? 'hr' : 'hrs'} × ₹{item.customer_hourly_price_snapshot}/hr)
                        </span>
                        <span className="font-mono font-semibold text-white">
                          ₹{item.customer_subtotal}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-slate-400">
                      <span>Subtotal (Taxable Value):</span>
                      <span className="font-mono">
                        ₹{(selectedBooking.subtotal || selectedBooking.items?.reduce((acc, it) => acc + it.customer_subtotal, 0) || Math.round(selectedBooking.customer_total / 1.18)).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-400">
                      <span className="flex items-center gap-1">
                        <span>GST (18% Govt. Tax):</span>
                        <span className="text-[10px] text-emerald-300 font-mono">(9% CGST + 9% SGST)</span>
                      </span>
                      <span className="font-mono font-semibold">
                        ₹{(selectedBooking.tax_amount || (selectedBooking.customer_total - (selectedBooking.subtotal || Math.round(selectedBooking.customer_total / 1.18)))).toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-bold text-white block">Grand Total Payable</span>
                        <span className="text-[10px] text-slate-400">Including 18% GST • Pay on Completion</span>
                      </div>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        ₹{selectedBooking.customer_total}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Doorstep OTP Verification on Arrival</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Tax Invoice</span>
                  </button>

                  {['pending', 'confirmed'].includes(selectedBooking.booking_status) && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standalone Tax Invoice Viewer Modal */}
      {selectedBooking && (
        <InvoiceViewModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          booking={selectedBooking}
          customerProfile={customerProfile || {
            id: customerId,
            full_name: 'Customer in Odisha',
            phone: '+91 98610 12345',
            email: 'customer@doorbly.in',
            preferred_language: 'en'
          }}
        />
      )}
    </div>
  );
};
