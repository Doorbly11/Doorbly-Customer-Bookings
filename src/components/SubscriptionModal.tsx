import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Sparkles, ShieldCheck, Zap, Star } from 'lucide-react';
import { CustomerProfile } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile?: CustomerProfile;
  onSubscriptionChange?: () => void;
}

export interface UserSubscription {
  planId: string;
  planName: string;
  price: number;
  durationMonths: number;
  startDate: string;
  endDate: string;
  discountPercentage: number;
  isActive: boolean;
}

const PLANS = [
  {
    id: 'silver-3m',
    name: 'Plus Silver',
    duration: '3 Months',
    price: 199,
    discountPercent: 10,
    features: [
      '10% Flat Discount on all 50+ trades',
      'Free doorstep visit inspection charge',
      'Zero cancellation fees anytime',
      'Standard customer care line'
    ]
  },
  {
    id: 'gold-6m',
    name: 'Plus Gold',
    popular: true,
    duration: '6 Months',
    price: 399,
    discountPercent: 15,
    features: [
      '15% Flat Discount on all 50+ trades',
      '45-Minute Priority technician arrival',
      '₹100 Instant wallet cashback bonus',
      'Zero surge / weekend rush pricing',
      'Priority WhatsApp technician tracking'
    ]
  },
  {
    id: 'elite-12m',
    name: 'Elite Annual',
    duration: '12 Months',
    price: 699,
    discountPercent: 20,
    features: [
      '20% Flat Discount on all 50+ trades',
      '2 Complimentary AC/Electrical safety checks',
      'Unlimited free doorstep inspections',
      'Dedicated Odisha Relationship Manager',
      'Cover entire family & household'
    ]
  }
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  onSubscriptionChange
}) => {
  const [activePlan, setActivePlan] = useState<UserSubscription | null>(() => {
    const saved = localStorage.getItem('doorbly_subscription_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isActive) return parsed;
      } catch (e) {
        console.error('Error parsing subscription data', e);
      }
    }
    return null;
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>('gold-6m');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (activePlan) {
      localStorage.setItem('doorbly_subscription_data', JSON.stringify(activePlan));
    }
  }, [activePlan]);

  if (!isOpen) return null;

  const handleSubscribe = (plan: typeof PLANS[0]) => {
    setIsSubscribing(true);
    setTimeout(() => {
      const now = new Date();
      const end = new Date();
      end.setMonth(now.getMonth() + (plan.id === 'silver-3m' ? 3 : plan.id === 'gold-6m' ? 6 : 12));

      const newSub: UserSubscription = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        durationMonths: plan.id === 'silver-3m' ? 3 : plan.id === 'gold-6m' ? 6 : 12,
        startDate: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        endDate: end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        discountPercentage: plan.discountPercent,
        isActive: true
      };

      setActivePlan(newSub);
      localStorage.setItem('doorbly_subscription_data', JSON.stringify(newSub));

      // Also credit ₹100 if gold plan
      if (plan.id === 'gold-6m') {
        const bal = parseFloat(localStorage.getItem('doorbly_wallet_balance') || '250');
        localStorage.setItem('doorbly_wallet_balance', (bal + 100).toString());
      }

      setIsSubscribing(false);
      setSuccessMessage(`Congratulations! You are now an active ${plan.name} member.`);
      if (onSubscriptionChange) onSubscriptionChange();
    }, 700);
  };

  const handleCancelPlan = () => {
    if (window.confirm('Are you sure you want to cancel your Doorbly Plus membership?')) {
      setActivePlan(null);
      localStorage.removeItem('doorbly_subscription_data');
      if (onSubscriptionChange) onSubscriptionChange();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Crown banner */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white font-['Outfit']">
                    My Subscription
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-white text-amber-800 text-[10px] font-black uppercase tracking-wider">
                    Doorbly Plus
                  </span>
                </div>
                <p className="text-xs text-amber-100 mt-0.5">
                  Save up to 20% on every doorstep hourly service across Odisha
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Active Subscription Banner if currently subscribed */}
          {activePlan ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-amber-500/30 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-extrabold text-amber-300">{activePlan.planName}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <span className="text-xs font-bold text-emerald-400">Active Membership</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Start Date</span>
                  <span className="text-xs font-semibold text-slate-200">{activePlan.startDate || 'Current Cycle'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiry Date</span>
                  <span className="text-xs font-semibold text-amber-300">{activePlan.endDate}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                  Active Benefits
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>{activePlan.discountPercentage}% Flat Discount</strong> on all 50+ trades</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free doorstep inspection visits with zero cancellation fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Priority technician dispatch across Odisha hubs</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                <span className="text-[11px] text-slate-400">
                  {customerProfile?.full_name ? `Member: ${customerProfile.full_name}` : 'Doorbly Club Member'}
                </span>
                <button
                  type="button"
                  onClick={handleCancelPlan}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          ) : (
            /* No Active Subscription Empty State */
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-center space-y-2">
              <Crown className="w-8 h-8 text-amber-500 mx-auto" />
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  No active subscription
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-sm mx-auto">
                  You are currently on standard pay-per-service billing. Choose a Plus membership below to unlock guaranteed discounts and priority dispatch.
                </p>
              </div>
            </div>
          )}

          {/* Success message banner */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Plan Selector */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              {activePlan ? 'Upgrade / Switch Membership Plan' : 'Select a Membership Plan'}
            </h3>

            <div className="space-y-3">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = activePlan?.planId === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-slate-950" /> Most Popular
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{plan.name}</span>
                          <span className="text-xs font-semibold text-slate-500">({plan.duration})</span>
                        </div>
                        <span className="text-xs font-black text-amber-700">
                          {plan.discountPercent}% OFF Every Service
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900">₹{plan.price}</span>
                        <span className="text-[10px] text-slate-400 block">one-time</span>
                      </div>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-600 mb-3 border-t border-slate-100 pt-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      disabled={isSubscribing || isCurrent}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubscribe(plan);
                      }}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : isSelected
                          ? 'bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Current Plan</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Subscribe for ₹{plan.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantee */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 block">Doorbly Odisha Guarantee</span>
              If you do not save at least your membership fee within your subscription duration, we refund the difference back to your wallet!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
