import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types';
import {
  fetchAllBookingsForAdmin,
  updateAdminBookingStatus,
  subscribeToAllBookingsRealtime
} from '../lib/supabase';
import { TaxInvoice, TaxInvoiceData } from './TaxInvoice';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  Search,
  RefreshCw,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  X,
  Printer,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface AdminBookingsViewProps {
  onShowToast: (msg: string) => void;
}

export function bookingToTaxInvoiceData(b: Booking): TaxInvoiceData {
  const taxPct = b.tax_percentage ?? 18;
  const subtotal = b.subtotal;
  const taxAmt = b.tax_amount ?? Math.round(subtotal * (taxPct / 100) * 100) / 100;
  const grandTotal = b.customer_total;

  const items = (b.items && b.items.length > 0)
    ? b.items.map(it => ({
        serviceName: it.service_name_snapshot,
        hourlyPrice: it.customer_hourly_price_snapshot,
        hours: it.hours,
        subtotal: it.customer_subtotal,
        taxAmount: it.tax_amount
      }))
    : [{
        serviceName: 'Doorstep Service in Odisha',
        hourlyPrice: b.subtotal / Math.max(1, b.total_hours),
        hours: b.total_hours,
        subtotal: b.subtotal,
        taxAmount: taxAmt
      }];

  return {
    invoiceNumber: b.invoice_number || `INV-OD-2026-${b.booking_reference?.replace(/\D/g, '').slice(-6) || '1001'}`,
    bookingReference: b.booking_reference,
    invoiceDate: new Date(b.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    customerProfile: {
      id: b.customer_id,
      full_name: b.customer_name || 'Customer',
      email: b.customer_email || '',
      phone: b.customer_phone || ''
    },
    customerAddress: b.service_address || {
      address_line: 'Doorstep Service Address',
      area: 'Bhubaneswar Metro',
      city: 'Bhubaneswar',
      district: 'Khordha',
      state: 'Odisha',
      pincode: '751001'
    },
    scheduledDate: b.scheduled_date,
    scheduledStartTime: b.scheduled_start_time,
    items,
    subtotal,
    taxPercentage: taxPct,
    taxAmount: taxAmt,
    grandTotal,
    paymentStatus: b.booking_status === 'completed' ? 'paid' : 'pay_on_completion'
  };
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({ onShowToast }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_desc' | 'scheduled_date'>('newest');

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Load bookings
  const loadBookings = async (showToastMsg = false) => {
    setIsRefreshing(true);
    try {
      const data = await fetchAllBookingsForAdmin();
      setBookings(data);
      if (showToastMsg) {
        onShowToast(`Synced ${data.length} bookings from Supabase`);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();

    // Listen to local update events
    const handleLocalUpdate = () => {
      loadBookings(false);
    };
    window.addEventListener('doorbly_bookings_updated', handleLocalUpdate);

    // Subscribe to Supabase realtime table changes
    const unsubscribe = subscribeToAllBookingsRealtime(() => {
      loadBookings(false);
    });

    return () => {
      window.removeEventListener('doorbly_bookings_updated', handleLocalUpdate);
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateAdminBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, booking_status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, booking_status: newStatus } : null);
      }
      onShowToast(`Booking status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      onShowToast('Failed to update status');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    onShowToast(`Copied ${text}`);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  // Metrics calculation
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.booking_status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.booking_status === 'confirmed').length;
  const inProgressCount = bookings.filter(b => b.booking_status === 'in-progress').length;
  const completedCount = bookings.filter(b => b.booking_status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.booking_status === 'cancelled').length;

  const totalGrossRevenue = bookings
    .filter(b => b.booking_status !== 'cancelled')
    .reduce((sum, b) => sum + (b.customer_total || 0), 0);

  const totalCommissionRevenue = bookings
    .filter(b => b.booking_status !== 'cancelled')
    .reduce((sum, b) => sum + ((b.subtotal || 0) * 0.2), 0);

  const totalPartnerPayout = bookings
    .filter(b => b.booking_status !== 'cancelled')
    .reduce((sum, b) => sum + ((b.subtotal || 0) * 0.8), 0);

  // Filtered & Sorted bookings
  const filteredBookings = bookings.filter(b => {
    // Status filter
    if (statusFilter !== 'all' && b.booking_status !== statusFilter) {
      return false;
    }

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const refMatch = b.booking_reference?.toLowerCase().includes(term);
    const invMatch = b.invoice_number?.toLowerCase().includes(term);
    const nameMatch = b.customer_name?.toLowerCase().includes(term);
    const phoneMatch = b.customer_phone?.toLowerCase().includes(term);
    const emailMatch = b.customer_email?.toLowerCase().includes(term);
    const areaMatch = b.service_address?.area?.toLowerCase().includes(term);
    const cityMatch = b.service_address?.city?.toLowerCase().includes(term);
    const itemsMatch = b.items?.some(it => it.service_name_snapshot?.toLowerCase().includes(term));

    return refMatch || invMatch || nameMatch || phoneMatch || emailMatch || areaMatch || cityMatch || itemsMatch;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'amount_desc') {
      return (b.customer_total || 0) - (a.customer_total || 0);
    }
    if (sortBy === 'scheduled_date') {
      return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
    }
    return 0;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock3 className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER & LIVE SYNC STATUS */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Customer Bookings & Live Supabase Orders
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Supabase Connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management of all customer orders, itemized pricing snapshots, 18% GST invoices, and partner payouts across Odisha.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadBookings(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync from Supabase'}</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Orders Placed</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 tracking-tight">
            {totalBookingsCount}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{pendingCount} pending</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{completedCount} done</span>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Gross Customer Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 tracking-tight">
            ₹{totalGrossRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Includes 18% GST (CGST + SGST)
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Doorbly Platform Cut (20%)</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 mt-2 tracking-tight">
            ₹{totalCommissionRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Net commission earned
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Partner Payout Pool (80%)</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2 tracking-tight">
            ₹{totalPartnerPayout.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Reserved for local Odisha technicians
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking Ref (DBLY-OD-...), Invoice #, Customer, Phone, Area..."
              className="w-full bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest Orders First</option>
              <option value="oldest">Oldest Orders First</option>
              <option value="amount_desc">Order Value: High to Low</option>
              <option value="scheduled_date">Scheduled Date (Upcoming)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Bookings ({totalBookingsCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-amber-400/80 hover:bg-slate-800'
            }`}
          >
            Pending Approval ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              statusFilter === 'confirmed'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-sky-400/80 hover:bg-slate-800'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              statusFilter === 'in-progress'
                ? 'bg-indigo-500 text-white font-bold shadow-sm'
                : 'bg-slate-900 text-indigo-400/80 hover:bg-slate-800'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-emerald-400/80 hover:bg-slate-800'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              statusFilter === 'cancelled'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'bg-slate-900 text-rose-400/80 hover:bg-slate-800'
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>
      </div>

      {/* BOOKINGS LIST / TABLE */}
      {isLoading ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-12 text-center">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300 text-sm font-medium">Fetching orders from Supabase database...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No bookings match your filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {searchTerm
              ? `No bookings found matching "${searchTerm}". Try resetting search or filter.`
              : 'No orders have been recorded in this category yet. When customers book services from the app or cart, they appear here live.'}
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const isCopied = copiedRef === b.booking_reference;
            const items = b.items || [];

            return (
              <div
                key={b.id}
                className="bg-slate-950/90 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-4 sm:p-5 transition-all shadow-md group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Ref, Date, Customer */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleCopy(b.booking_reference || b.id)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                        title="Click to copy booking reference"
                      >
                        <span>{b.booking_reference || b.id.slice(0, 14)}</span>
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>

                      {b.invoice_number && (
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                          {b.invoice_number}
                        </span>
                      )}

                      {getStatusBadge(b.booking_status)}

                      <span className="text-[11px] text-slate-400 ml-auto lg:ml-0">
                        Placed: {new Date(b.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-200 font-medium">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                          {b.customer_name ? b.customer_name.charAt(0) : 'C'}
                        </div>
                        <span className="truncate">{b.customer_name || 'Customer in Odisha'}</span>
                        {b.customer_phone && (
                          <a
                            href={`tel:${b.customer_phone}`}
                            className="text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-mono text-[11px]"
                            title="Call customer"
                          >
                            <Phone className="w-3 h-3" />
                            {b.customer_phone}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">
                          {b.service_address
                            ? `${b.service_address.area}, ${b.service_address.city} (${b.service_address.pincode})`
                            : 'Doorstep Service, Odisha'}
                        </span>
                      </div>
                    </div>

                    {/* Booked Services Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {items.map((it, idx) => (
                        <span
                          key={it.id || idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          <span className="text-white font-semibold">{it.service_name_snapshot}</span>
                          <span className="text-indigo-400">({it.hours}h @ ₹{it.customer_hourly_price_snapshot}/h)</span>
                        </span>
                      ))}
                      {items.length === 0 && (
                        <span className="text-xs text-slate-400">Standard Doorstep Service ({b.total_hours} hrs)</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Financials & Admin Actions */}
                  <div className="flex flex-wrap lg:flex-col items-end justify-between lg:justify-center gap-3 border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Customer Total (inc. 18% GST)</div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-400">
                        ₹{b.customer_total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Partner Payout: <span className="text-purple-300 font-semibold">₹{(b.subtotal * 0.8).toFixed(0)}</span> | Cut: <span className="text-cyan-300 font-semibold">₹{(b.subtotal * 0.2).toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status quick select */}
                      <select
                        value={b.booking_status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* View Invoice */}
                      <button
                        onClick={() => setInvoiceBooking(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                        title="View Official Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Invoice</span>
                      </button>

                      {/* View Details */}
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL BOOKING DETAILS MODAL / DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Order Details</h3>
                  <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {selectedBooking.booking_reference}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Created on {new Date(selectedBooking.created_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Status Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Current Status</span>
                  <div className="mt-1">{getStatusBadge(selectedBooking.booking_status)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Change Status:</span>
                  <select
                    value={selectedBooking.booking_status}
                    onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as BookingStatus)}
                    className="bg-slate-900 border border-slate-700 text-xs font-semibold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Scheduled Date
                  </div>
                  <div className="text-sm font-bold text-white">
                    {new Date(selectedBooking.scheduled_date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Time Slot & Duration
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedBooking.scheduled_start_time} ({selectedBooking.total_hours} Hours)
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Customer Details
                </h4>
                <div className="text-sm font-semibold text-white">
                  {selectedBooking.customer_name || 'Customer in Odisha'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedBooking.customer_phone && (
                    <a
                      href={`tel:${selectedBooking.customer_phone}`}
                      className="text-slate-300 hover:text-emerald-400 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedBooking.customer_phone}
                    </a>
                  )}
                  {selectedBooking.customer_email && (
                    <a
                      href={`mailto:${selectedBooking.customer_email}`}
                      className="text-slate-300 hover:text-indigo-400 flex items-center gap-1.5 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {selectedBooking.customer_email}
                    </a>
                  )}
                </div>

                {selectedBooking.service_address && (
                  <div className="pt-1.5 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div>{selectedBooking.service_address.address_line}</div>
                      <div className="text-slate-400">
                        {selectedBooking.service_address.area}, {selectedBooking.service_address.city},{' '}
                        {selectedBooking.service_address.district}, Odisha - {selectedBooking.service_address.pincode}
                      </div>
                    </div>
                  </div>
                )}

                {selectedBooking.notes && (
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <strong className="text-indigo-300">Customer Note:</strong> {selectedBooking.notes}
                  </div>
                )}
              </div>

              {/* Itemized Services Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Booked Services & Financial Breakdown
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-left">
                        <th className="p-3">Service Name</th>
                        <th className="p-3 text-right">Hours</th>
                        <th className="p-3 text-right">Customer Rate</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {selectedBooking.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-medium">{it.service_name_snapshot}</td>
                          <td className="p-3 text-right font-mono">{it.hours} hrs</td>
                          <td className="p-3 text-right font-mono">₹{it.customer_hourly_price_snapshot}/h</td>
                          <td className="p-3 text-right font-mono font-bold text-white">₹{it.customer_subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-900/60 border-t border-slate-800 text-xs">
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right text-slate-400">Subtotal:</td>
                        <td className="p-2.5 text-right font-mono font-bold text-white">₹{selectedBooking.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right text-slate-400">
                          GST (CGST 9% + SGST 9%):
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-300">
                          ₹{(selectedBooking.tax_amount ?? selectedBooking.subtotal * 0.18).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border-t border-slate-800 font-bold">
                        <td colSpan={3} className="p-3 text-right text-white">Grand Total:</td>
                        <td className="p-3 text-right font-mono text-emerald-400 text-sm">
                          ₹{selectedBooking.customer_total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Commission & Partner Accounting */}
              <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400">Doorbly Platform Commission (20%)</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    ₹{(selectedBooking.subtotal * 0.2).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Partner Payout (80%)</div>
                  <div className="text-base font-bold text-purple-400 mt-0.5">
                    ₹{(selectedBooking.subtotal * 0.8).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setInvoiceBooking(selectedBooking);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>View Tax Invoice</span>
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAX INVOICE MODAL */}
      {invoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900">
            {/* Invoice Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm">Tax Invoice: {invoiceBooking.invoice_number || invoiceBooking.booking_reference}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setInvoiceBooking(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Component Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <TaxInvoice
                data={bookingToTaxInvoiceData(invoiceBooking)}
                showPrintButton={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
