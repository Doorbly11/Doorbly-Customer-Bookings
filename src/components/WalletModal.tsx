import React, { useState, useEffect } from 'react';
import { X, Wallet, ArrowDownLeft, ArrowUpRight, Plus, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CustomerProfile } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile?: CustomerProfile;
}

interface WalletTransaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  customerProfile
}) => {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('doorbly_wallet_balance');
    return saved !== null ? parseFloat(saved) : 0;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('doorbly_wallet_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse transactions', e);
      }
    }
    return [];
  });

  const [txFilter, setTxFilter] = useState<'all' | 'credit' | 'debit' | 'refund'>('all');
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [customInput, setCustomInput] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('doorbly_wallet_balance', balance.toString());
    localStorage.setItem('doorbly_wallet_transactions', JSON.stringify(transactions));
  }, [balance, transactions]);

  if (!isOpen) return null;

  const handleQuickAdd = (amt: number) => {
    setRechargeAmount(amt);
    setCustomInput('');
  };

  const handleAddFunds = () => {
    const finalAmount = customInput ? parseFloat(customInput) : rechargeAmount;
    if (isNaN(finalAmount) || finalAmount < 50) return;

    setIsAdding(true);
    setTimeout(() => {
      // Calculate 10% bonus cashback on recharges >= 500
      const cashback = finalAmount >= 500 ? Math.round(finalAmount * 0.1) : 0;
      const totalCredit = finalAmount + cashback;

      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        title: cashback > 0 ? `Wallet Top-Up + ₹${cashback} Bonus` : 'Wallet Top-Up',
        description: `Added via UPI / NetBanking`,
        amount: totalCredit,
        type: 'credit',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setBalance(prev => prev + totalCredit);
      setTransactions(prev => [newTx, ...prev]);
      setIsAdding(false);
      setShowSuccess(true);
      setCustomInput('');

      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Doorbly Wallet</h2>
              <p className="text-xs text-slate-300">Fast 1-click doorstep service payments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Balance Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-100 mb-1">
              <span>Available Balance</span>
              <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" /> 100% Safe
              </span>
            </div>
            <div className="text-3xl font-black tracking-tight mb-2">
              ₹{balance.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-tight">
              Auto-applied for discounts at checkout on all 50+ hourly trade bookings across Odisha.
            </p>
          </div>

          {/* Success Toast */}
          {showSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Money added successfully with bonus cashback!</span>
            </div>
          )}

          {/* Top Up Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Add Money to Wallet
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { amt: 500, tag: '+₹50 Extra' },
                { amt: 1000, tag: '+₹100 Extra' },
                { amt: 2000, tag: '+₹200 Extra' }
              ].map(({ amt, tag }) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAdd(amt)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    rechargeAmount === amt && !customInput
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="text-sm font-black">₹{amt}</div>
                  <div className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/80 rounded px-1 mt-0.5 inline-block">
                    {tag}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Or enter custom amount"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                  }}
                  className="w-full pl-7 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  min="50"
                  max="50000"
                />
              </div>
              <button
                type="button"
                onClick={handleAddFunds}
                disabled={isAdding}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
              >
                {isAdding ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Benefits Info */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Wallet Perks in Odisha</span>
            </div>
            <ul className="space-y-1 text-slate-500 text-[11px] list-disc list-inside">
              <li>Instant 1-click booking without UPI pin drops</li>
              <li>Priority doorstep dispatch across 30 districts</li>
              <li>100% instant refund on cancellations or reschedules</li>
            </ul>
          </div>

          {/* Recent Transactions & Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Passbook & History</span>
              <span className="text-[10px] text-slate-400">{transactions.length} record(s)</span>
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5 pb-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'credit', label: 'Credits' },
                { id: 'debit', label: 'Debits' },
                { id: 'refund', label: 'Refunds' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTxFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    txFilter === f.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {(() => {
              const filteredTx = transactions.filter(t => {
                if (txFilter === 'all') return true;
                if (txFilter === 'credit') return t.type === 'credit' && !t.title.toLowerCase().includes('refund');
                if (txFilter === 'debit') return t.type === 'debit';
                if (txFilter === 'refund') return t.title.toLowerCase().includes('refund') || t.description.toLowerCase().includes('refund');
                return true;
              });

              if (filteredTx.length === 0) {
                return (
                  <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/70 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-600">No wallet transactions available.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Top-up funds or receive refunds for cancelled bookings.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredTx.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {tx.type === 'credit' ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">{tx.title}</span>
                          <span className="text-[10px] text-slate-400 block">{tx.date}</span>
                        </div>
                      </div>
                      <span className={`font-black text-xs ${
                        tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {customerProfile?.full_name ? `Linked to ${customerProfile.full_name}` : 'Odisha Doorstep Wallet'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
