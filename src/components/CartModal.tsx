import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { CartItem, CustomerAddress, CustomerProfile, Service } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateHours: (serviceId: string, delta: number) => void;
  onRemoveItem: (serviceId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  customerProfile?: CustomerProfile;
  currentAddress: CustomerAddress;
  onOpenLocationModal: () => void;
  onQuickAddService?: (service: Service) => void;
  onExploreServices: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateHours,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  customerProfile,
  currentAddress,
  onOpenLocationModal,
  onExploreServices
}) => {
  if (!isOpen) return null;

  const getServiceRate = (service: Service): number => {
    return service.customer_price ?? service.customer_hourly_price ?? 0;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (getServiceRate(item.service) * item.hours);
  }, 0);

  // Check subscription discount
  const subData = localStorage.getItem('doorbly_subscription_data');
  let discountPercent = 0;
  if (subData) {
    try {
      const parsed = JSON.parse(subData);
      if (parsed.isActive) discountPercent = parsed.discountPercentage || 0;
    } catch (e) {
      console.error(e);
    }
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gst = Math.round(taxableAmount * 0.18);
  const total = taxableAmount + gst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Doorstep Cart</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-300">Verified hourly technicians in Odisha</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Location Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-800 block truncate">
                  {currentAddress.city || 'Bhubaneswar'}, {currentAddress.district || 'Khordha'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {currentAddress.address_line || currentAddress.area || 'Doorstep Service Location'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenLocationModal();
              }}
              className="text-emerald-700 font-bold hover:underline shrink-0 text-xs ml-2 cursor-pointer"
            >
              Change
            </button>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  You have not added any hourly doorstep services yet. Browse our verified technicians across Odisha.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreServices();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>Browse 50+ Hourly Trades</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider text-[10px]">Hourly Services</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-rose-600 hover:text-rose-700 font-bold transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div 
                    key={item.service.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 truncate">
                          {item.service.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
                          ₹{getServiceRate(item.service)}/hr
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {item.service.category_slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Hours counter */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => onUpdateHours(item.service.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-800 w-5 text-center">
                          {item.hours}h
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateHours(item.service.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right min-w-[55px]">
                        <span className="text-xs font-black text-slate-900 block">
                          ₹{getServiceRate(item.service) * item.hours}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.service.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="font-bold text-slate-900 mb-1">Pricing Breakdown</div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Base Rate Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Plus Member Discount ({discountPercent}%)
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Govt. Tax)</span>
                  <span className="font-bold text-slate-800">₹{gst}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-base text-emerald-700 font-black">₹{total}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex items-center gap-2 text-[11px] text-emerald-950 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep billing starts only after technician arrives and OTP is verified.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Due</span>
              <span className="text-lg font-black text-slate-900">₹{total}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Schedule Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
