import React from 'react';
import { Booking, CustomerProfile } from '../types';
import { TaxInvoice, TaxInvoiceData } from './TaxInvoice';
import { X } from 'lucide-react';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  customerProfile: CustomerProfile;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  onClose,
  booking,
  customerProfile
}) => {
  if (!isOpen || !booking) return null;

  const invoiceNumber = booking.invoice_number || `INV-OD-${new Date(booking.created_at || Date.now()).getFullYear()}-${booking.booking_reference?.replace(/\D/g, '').slice(-6) || '883921'}`;
  const subtotal = booking.subtotal || booking.items?.reduce((acc, it) => acc + it.customer_subtotal, 0) || booking.customer_total;
  const taxPercentage = booking.tax_percentage ?? 18;
  const taxAmount = booking.tax_amount ?? (Math.round(subtotal * (taxPercentage / 100) * 100) / 100);
  const grandTotal = booking.customer_total || (subtotal + taxAmount);

  const invoiceData: TaxInvoiceData = {
    invoiceNumber,
    bookingReference: booking.booking_reference,
    invoiceDate: new Date(booking.created_at || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    customerProfile,
    customerAddress: booking.service_address || {
      address_line: 'Doorstep Service Address',
      area: 'Patia',
      city: 'Bhubaneswar',
      district: 'Khordha',
      state: 'Odisha',
      pincode: '751024'
    },
    scheduledDate: booking.scheduled_date,
    scheduledStartTime: booking.scheduled_start_time,
    items: booking.items && booking.items.length > 0
      ? booking.items.map(it => ({
          serviceName: it.service_name_snapshot,
          hourlyPrice: it.customer_hourly_price_snapshot,
          hours: it.hours,
          subtotal: it.customer_subtotal,
          taxAmount: it.tax_amount || Math.round(it.customer_subtotal * 0.18 * 100) / 100
        }))
      : [{
          serviceName: 'Hourly Doorstep Maintenance Service',
          hourlyPrice: Math.round(subtotal / (booking.total_hours || 1)),
          hours: booking.total_hours || 1,
          subtotal: subtotal,
          taxAmount: taxAmount
        }],
    subtotal,
    taxPercentage,
    taxAmount,
    grandTotal,
    paymentStatus: booking.booking_status === 'completed' ? 'paid' : 'pay_on_completion'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          id="btn-close-invoice-view-modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-2">
          <TaxInvoice data={invoiceData} showPrintButton={true} />
        </div>
      </div>
    </div>
  );
};
