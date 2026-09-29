import React from 'react';
import { CustomerAddress, CustomerProfile, BookingItem } from '../types';
import { Printer, ShieldCheck, CheckCircle2, Download, MapPin, Calendar, Clock, FileText } from 'lucide-react';

export interface TaxInvoiceData {
  invoiceNumber: string;
  bookingReference?: string;
  invoiceDate: string;
  customerProfile: CustomerProfile;
  customerAddress: CustomerAddress;
  scheduledDate: string;
  scheduledStartTime: string;
  items: {
    serviceName: string;
    hourlyPrice: number;
    hours: number;
    subtotal: number;
    taxAmount?: number;
  }[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  paymentStatus?: 'pending' | 'paid' | 'pay_on_completion';
}

interface TaxInvoiceProps {
  data: TaxInvoiceData;
  showPrintButton?: boolean;
}

// Convert amount to Indian currency words
function numberToWords(num: number): string {
  const rounded = Math.round(num);
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (rounded === 0) return 'Zero Rupees Only';

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    if (n < 1000) return inWords(Math.floor(n / 100)) + 'Hundred ' + (n % 100 !== 0 ? inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
  }

  return 'Rupees ' + inWords(rounded).trim() + ' Only';
}

export const TaxInvoice: React.FC<TaxInvoiceProps> = ({ data, showPrintButton = true }) => {
  const cgstRate = data.taxPercentage / 2; // 9%
  const sgstRate = data.taxPercentage / 2; // 9%
  const cgstAmount = Math.round((data.subtotal * (cgstRate / 100)) * 100) / 100;
  const sgstAmount = Math.round((data.subtotal * (sgstRate / 100)) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="doorbly-tax-invoice">
      {/* Print Trigger bar */}
      {showPrintButton && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Official Proforma Tax Invoice (GST Compliant)</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            id="btn-print-invoice"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      )}

      {/* Invoice Document Body */}
      <div className="p-6 sm:p-8 space-y-6 text-slate-800">
        {/* 1. Header: Brand & GST Credentials */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                D
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Doorbly Technologies (Odisha)
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified Doorstep Hourly Services Platform
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 space-y-0.5 leading-relaxed">
              <p>Sundarpada, Bhubaneswar</p>
              <p>District: Khordha, Odisha - 751002</p>
              <p className="font-mono font-medium text-slate-700">
                GSTIN: <span className="text-slate-900 font-bold">21AAACD1234F1Z8</span> (State Code: 21)
              </p>
              <p>Email: support@doorbly.com | Ph: +91 99387 13179</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
              TAX INVOICE
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-slate-500">
                Invoice No: <span className="font-mono font-bold text-slate-900">{data.invoiceNumber}</span>
              </p>
              {data.bookingReference && (
                <p className="text-slate-500">
                  Booking Ref: <span className="font-mono font-semibold text-emerald-800">{data.bookingReference}</span>
                </p>
              )}
              <p className="text-slate-500">
                Date: <span className="font-medium text-slate-800">{data.invoiceDate}</span>
              </p>
              <p className="text-slate-500">
                Place of Supply: <span className="font-medium text-slate-800">Odisha (21)</span>
              </p>
              <p className="text-slate-500">
                Payment: <span className="font-medium text-emerald-700">Pay on Doorstep Completion</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Customer & Delivery Address Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Billed To (Customer)
            </span>
            <div className="font-bold text-slate-900 text-sm">{data.customerProfile.full_name}</div>
            <div className="text-slate-600 mt-0.5">{data.customerProfile.phone}</div>
            <div className="text-slate-600">{data.customerProfile.email}</div>
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Doorstep Service Location
            </span>
            <div className="flex items-start gap-1 text-slate-800 font-medium leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {data.customerAddress.address_line}
                <br />
                {data.customerAddress.area ? `${data.customerAddress.area}, ` : ''}
                {data.customerAddress.city}, {data.customerAddress.district}, Odisha - {data.customerAddress.pincode}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                {data.scheduledDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                {data.scheduledStartTime}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Items & SAC Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Service Description</th>
                <th className="py-2.5 px-2 text-center">SAC</th>
                <th className="py-2.5 px-3 text-right">Rate / Hr</th>
                <th className="py-2.5 px-2 text-center">Hours</th>
                <th className="py-2.5 px-3 text-right">Taxable Amt</th>
                <th className="py-2.5 px-2 text-right">CGST (9%)</th>
                <th className="py-2.5 px-2 text-right">SGST (9%)</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item, idx) => {
                const itemCgst = Math.round((item.subtotal * (cgstRate / 100)) * 100) / 100;
                const itemSgst = Math.round((item.subtotal * (sgstRate / 100)) * 100) / 100;
                const itemTotal = Math.round((item.subtotal + itemCgst + itemSgst) * 100) / 100;

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.serviceName}</div>
                      <div className="text-[10px] text-slate-500">Doorstep Hourly Technical Service</div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-600">9987</td>
                    <td className="py-3 px-3 text-right font-mono font-medium">₹{item.hourlyPrice}</td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">{item.hours}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">₹{item.subtotal}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">₹{itemCgst}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">₹{itemSgst}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">₹{itemTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Tax Breakdown & Calculations */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-200">
          <div className="w-full sm:w-1/2 space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Amount in Words
              </span>
              <p className="font-semibold text-slate-900 italic">
                {numberToWords(data.grandTotal)}
              </p>
            </div>

            <div className="flex items-center gap-2 text-slate-600 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes 18% Goods & Services Tax (GST) as per Govt. of Odisha regulations.</span>
            </div>
          </div>

          <div className="w-full sm:w-1/2 max-w-xs ml-auto space-y-2 text-xs">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Taxable Value (Subtotal):</span>
              <span className="font-mono font-semibold text-slate-900">₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Central GST (CGST 9%):</span>
              <span className="font-mono text-slate-800">₹{cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>State GST (SGST 9%):</span>
              <span className="font-mono text-slate-800">₹{sgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 border-t border-slate-200">
              <span className="font-medium text-slate-700">Total Tax Amount (18%):</span>
              <span className="font-mono font-bold text-emerald-800">₹{data.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-950">
              <span>Total Payable:</span>
              <span className="font-mono text-base text-emerald-900 font-extrabold">₹{data.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* 5. Signatory & Declaration */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px] text-slate-500">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Declaration & Terms:</p>
            <p>1. Hourly rate applies from partner arrival to job completion.</p>
            <p>2. Verify partner credentials and share OTP at doorstep.</p>
            <p>3. This is a computer-generated GST tax invoice.</p>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <div className="w-36 h-12 border-b border-slate-300 flex items-center justify-center text-[10px] text-slate-400 italic">
              Authorized Signature
            </div>
            <p className="mt-1 font-semibold text-slate-700">Doorbly Technologies Odisha</p>
          </div>
        </div>
      </div>
    </div>
  );
};
