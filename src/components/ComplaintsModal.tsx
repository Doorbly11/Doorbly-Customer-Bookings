import React, { useState, useEffect } from 'react';
import { CustomerProfile, Booking } from '../types';
import { submitCustomerComplaint, fetchCustomerComplaints, CustomerComplaint } from '../lib/supabase';
import { 
  X, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldAlert,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface ComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: CustomerProfile;
  bookings?: Booking[];
  onOpenBookingDetails?: (booking: Booking) => void;
}

export const ComplaintsModal: React.FC<ComplaintsModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  bookings = []
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [category, setCategory] = useState<'booking' | 'partner' | 'payment' | 'cancellation' | 'refund' | 'other'>('booking');
  const [selectedBookingRef, setSelectedBookingRef] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [phone, setPhone] = useState<string>(customerProfile.phone || '');
  const [email, setEmail] = useState<string>(customerProfile.email || '');
  const [fullName, setFullName] = useState<string>(customerProfile.full_name || '');
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<CustomerComplaint | null>(null);
  const [complaintHistory, setComplaintHistory] = useState<CustomerComplaint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (customerProfile.full_name) setFullName(customerProfile.full_name);
    if (customerProfile.phone) setPhone(customerProfile.phone);
    if (customerProfile.email) setEmail(customerProfile.email);
  }, [customerProfile]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, customerProfile.id]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const history = await fetchCustomerComplaints(customerProfile.id, customerProfile.phone);
      setComplaintHistory(history);
    } catch (err) {
      console.warn('Failed to load complaint history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMsg('Please enter both subject and detailed description.');
      return;
    }
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const result = await submitCustomerComplaint({
        customer_id: customerProfile.id,
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
        booking_reference: selectedBookingRef || undefined,
        category,
        subject: subject.trim(),
        description: description.trim()
      });

      setSubmittedComplaint(result);
      setComplaintHistory(prev => [result, ...prev]);
      setSubject('');
      setDescription('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'booking': return 'Booking Issue';
      case 'partner': return 'Service Partner Conduct / Delay';
      case 'payment': return 'Payment / Overcharging';
      case 'cancellation': return 'Cancellation Dispute';
      case 'refund': return 'Refund Status';
      default: return 'Other Issue';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="complaints-modal-card"
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Complaints & Issues
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Direct escalation to Doorbly Odisha Grievance Cell
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-5 pt-3 gap-4 text-xs font-bold bg-white">
          <button
            type="button"
            onClick={() => {
              setActiveTab('new');
              setSubmittedComplaint(null);
            }}
            className={`pb-2.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'new'
                ? 'border-rose-600 text-rose-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Report New Problem
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-rose-600 text-rose-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>My Submitted Issues</span>
            {complaintHistory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-black">
                {complaintHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'new' ? (
            submittedComplaint ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Complaint Registered Successfully
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Your ticket <strong className="text-slate-800">{submittedComplaint.complaint_number}</strong> has been stored in Supabase and assigned to our Odisha Support Operations Team.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ticket Number:</span>
                    <span className="font-bold text-slate-900">{submittedComplaint.complaint_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-bold text-slate-900">{getCategoryLabel(submittedComplaint.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Under Review
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Resolution:</span>
                    <span className="font-bold text-emerald-700">Within 4 Hours</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    View All Issues
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedComplaint(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    File Another Issue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    What is this issue related to? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'booking', label: 'Booking' },
                      { id: 'partner', label: 'Service Partner' },
                      { id: 'payment', label: 'Payment' },
                      { id: 'cancellation', label: 'Cancellation' },
                      { id: 'refund', label: 'Refund' },
                      { id: 'other', label: 'Other Issue' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          category === item.id
                            ? 'bg-rose-50 text-rose-900 border-rose-300 ring-2 ring-rose-200/50 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Related Booking Selector (if available) */}
                {bookings.length > 0 && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Link Booking Reference (Optional)
                    </label>
                    <select
                      value={selectedBookingRef}
                      onChange={(e) => setSelectedBookingRef(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    >
                      <option value="">-- No specific booking --</option>
                      {bookings.map(b => (
                        <option key={b.id} value={b.booking_reference}>
                          {b.booking_reference} • {b.scheduled_date} ({b.booking_status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Subject / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Technician delayed by 40 minutes / Incorrect billing amount"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Detailed Explanation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what occurred, dates, technician details or transaction IDs..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                  />
                </div>

                {/* Contact info row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Debabrata"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9938713179"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Grievance</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                  <span>Loading complaints from Supabase...</span>
                </div>
              ) : complaintHistory.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">
                    No complaints submitted
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    You have no active disputes or grievance reports on record.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    <span>File an Issue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                complaintHistory.map(comp => (
                  <div
                    key={comp.id || comp.complaint_number}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {comp.complaint_number}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {getCategoryLabel(comp.category)}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1">
                          {comp.subject}
                        </h4>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        comp.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {comp.status === 'resolved' ? 'Resolved' : 'Under Review'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(comp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {comp.booking_reference && (
                        <span>Ref: {comp.booking_reference}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
