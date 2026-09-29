import React, { useState, useMemo } from 'react';
import { Service } from '../types';
import { Search, X, Wrench, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

interface SearchServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onSelectService: (service: Service) => void;
  onAddToCart?: (service: Service) => void;
}

export const SearchServicesModal: React.FC<SearchServicesModalProps> = ({
  isOpen,
  onClose,
  services,
  onSelectService,
  onAddToCart
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) {
      return services.slice(0, 10);
    }
    const q = searchTerm.toLowerCase().trim();
    return services
      .filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.category_name && s.category_name.toLowerCase().includes(q))
      )
      .slice(0, 30);
  }, [searchTerm, services]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="search-services-modal-card"
        className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by trade, appliance or task (e.g. Electrician, AC Repair, RO Filter)..."
            className="w-full text-sm font-semibold bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {searchTerm ? `Found ${filteredServices.length} Services` : 'Popular Verified Trades'}
            </span>
            <span className="text-[10px] text-slate-400">
              Total Catalog: {services.length}
            </span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-600">No services match "{searchTerm}"</p>
              <p>Try searching for Plumbing, Electrical, Cleaning or Appliance Repair.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 transition-all flex items-center justify-between gap-3 shadow-2xs group"
                >
                  <div 
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectService(service);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {service.name}
                      </span>
                      {service.category_name && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 shrink-0">
                          {service.category_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-emerald-700">
                        ₹{service.customer_hourly_price}/hr
                      </span>
                      <span className="text-[10px] text-slate-400">• Verified Provider</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart(service);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
                        title="Add to cart"
                      >
                        <Plus className="w-3.5 h-3.5 inline mr-1" />
                        Cart
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectService(service);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
