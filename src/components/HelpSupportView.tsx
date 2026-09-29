import React from 'react';
import { HelpCircle, Phone, Mail, MapPin, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { VfxCard } from './VfxCard';

interface HelpSupportViewProps {
  onExploreServices: () => void;
  onGoBack?: () => void;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onExploreServices, onGoBack }) => {
  const faqs = [
    {
      q: "How does hourly booking on Doorbly work?",
      a: "You select a verified service partner from our catalog, choose your required duration (e.g. 2 hours), and select your doorstep location in Odisha. Pricing is strictly calculated based on the transparent hourly rate multiplied by the hours booked."
    },
    {
      q: "Which areas in Odisha are covered?",
      a: "Doorbly currently operates across all 30 districts of Odisha, with active hubs in Bhubaneswar, Cuttack, Puri, Rourkela, Berhampur, Sambalpur, Balasore, Jajpur, Angul, and surrounding towns."
    },
    {
      q: "Are Doorbly service partners background-verified?",
      a: "Yes. Every service partner undergoes Aadhaar KYC validation, local address verification, and trade skill testing before being assigned to customer bookings."
    },
    {
      q: "When and how do I pay?",
      a: "You pay directly after service completion either via UPI, Cash, or QR code shown by the service partner upon job completion. The price displayed at booking time is guaranteed with no hidden fees."
    },
    {
      q: "Can I extend the service duration during the job?",
      a: "Yes. If your task requires additional hours, the partner will log the additional time with your confirmation at the exact same hourly rate."
    },
    {
      q: "How do I cancel or reschedule a booking?",
      a: "You can cancel any booking before the partner arrives directly from the 'My Bookings' page without any cancellation fee."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Go Back button */}
      {onGoBack && (
        <div className="mb-6">
          <button
            onClick={onGoBack}
            id="btn-goback-support"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div
        className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 mb-10 text-center max-w-3xl mx-auto border border-emerald-500/30 shadow-xl shadow-slate-950/40 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #042f2e 45%, #022c22 75%, #0f172a 100%)'
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full mb-3.5 shadow-inner">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Odisha Customer Support & Guidelines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed font-normal">
            Everything you need to know about transparent hourly doorstep services in Odisha.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <VfxCard glowColor="emerald" className="h-full">
          <div className="p-5 flex items-start gap-3.5 bg-white h-full group-hover:bg-emerald-50/20 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 transition-all duration-200 shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block card-subtext">Customer Helpline</span>
              <a 
                href="tel:9938713179"
                className="text-base font-bold text-slate-900 mt-0.5 font-mono card-title group-hover:text-emerald-700 hover:underline transition-colors block"
              >
                +91 99387 13179
              </a>
              <span className="text-[11px] text-slate-500 block card-text">7:00 AM – 9:00 PM IST (All Days)</span>
            </div>
          </div>
        </VfxCard>

        <VfxCard glowColor="emerald" className="h-full">
          <div className="p-5 flex items-start gap-3.5 bg-white h-full group-hover:bg-emerald-50/20 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 transition-all duration-200 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block card-subtext">Email Support</span>
              <a 
                href="mailto:support@doorbly.com"
                className="text-base font-bold text-slate-900 mt-0.5 card-title group-hover:text-emerald-700 hover:underline transition-colors block"
              >
                support@doorbly.com
              </a>
              <span className="text-[11px] text-slate-500 block card-text">Quick resolution within 2 hours</span>
            </div>
          </div>
        </VfxCard>

        <VfxCard glowColor="emerald" className="h-full">
          <div className="p-5 flex items-start gap-3.5 bg-white h-full group-hover:bg-emerald-50/20 transition-colors duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 transition-all duration-200 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block card-subtext">Odisha Head Office</span>
              <div className="text-sm font-semibold text-slate-900 mt-0.5 card-title group-hover:text-emerald-700 transition-colors">Sundarpada</div>
              <span className="text-[11px] text-slate-500 block card-text">Bhubaneswar, Odisha 751002</span>
            </div>
          </div>
        </VfxCard>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <VfxCard key={i} glowColor="emerald" className="h-full">
              <div className="p-5 bg-white h-full flex flex-col justify-between group-hover:bg-emerald-50/10 transition-colors duration-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug group-hover:text-emerald-700 transition-colors">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </VfxCard>
          ))}
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onExploreServices}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-2xl transition-all shadow-md hover:shadow-emerald-600/25 cursor-pointer"
        >
          <span>Explore Service Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
