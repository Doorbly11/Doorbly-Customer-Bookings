import React, { useState } from 'react';
import { CustomerProfile, CustomerAddress } from '../types';
import { RealLocationDetails } from '../lib/useDeviceStatus';
import {
  X,
  Settings,
  User,
  Bell,
  MapPin,
  Shield,
  FileText,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: CustomerProfile;
  currentAddress: CustomerAddress;
  locationStatus?: RealLocationDetails;
  onOpenProfile: () => void;
  onRequestLocationPermission?: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  currentAddress,
  locationStatus,
  onOpenProfile,
  onRequestLocationPermission,
  onLogout
}) => {
  const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'location' | 'legal'>('account');
  const [smsEnabled, setSmsEnabled] = useState<boolean>(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(true);
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [legalView, setLegalView] = useState<'privacy' | 'terms' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="settings-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Settings & Preferences
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Customer account & application controls
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-5 pt-3 gap-4 text-xs font-bold bg-white overflow-x-auto">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'location', label: 'Location', icon: MapPin },
            { id: 'legal', label: 'Privacy & Terms', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSection(tab.id as any);
                  setLegalView(null);
                }}
                className={`pb-2.5 flex items-center gap-1.5 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-indigo-600 text-indigo-600 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar text-xs">
          {activeSection === 'account' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {customerProfile.full_name || 'Guest Customer'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProfile();
                      onClose();
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold text-slate-800">{customerProfile.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-slate-800">{customerProfile.email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current City:</span>
                    <span className="font-semibold text-slate-800">{currentAddress.city}, Odisha</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-rose-900">Sign Out</h4>
                  <p className="text-[11px] text-rose-700/80">
                    Safely log out of your Doorbly customer account on this browser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-3">
              <p className="text-slate-500 text-[11px] mb-2">
                Choose how you prefer to receive real-time booking updates, technician tracking, and invoices:
              </p>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">SMS Notifications</div>
                  <div className="text-[11px] text-slate-500">Booking confirmation & arrival OTP codes</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">WhatsApp Alerts</div>
                  <div className="text-[11px] text-slate-500">Live GPS tracking link & GST digital invoice</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">In-App Push Updates</div>
                  <div className="text-[11px] text-slate-500">Partner assignment and status change alerts</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeSection === 'location' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">Device Location Permissions</span>
                </div>

                <div className="space-y-2 text-slate-600 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span>GPS Permission State:</span>
                    <span className="font-bold text-emerald-700">
                      {locationStatus?.coords ? 'Granted (Live)' : locationStatus?.permissionState === 'denied' ? 'Denied / Blocked' : 'Not Requested'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Service Hub:</span>
                    <span className="font-bold text-slate-800">{currentAddress.city}, Odisha</span>
                  </div>
                </div>

                {locationStatus?.permissionState === 'denied' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                    Location access is blocked by your browser. Please tap the lock/tune icon in your browser URL bar to allow location.
                  </div>
                )}

                {onRequestLocationPermission && (
                  <button
                    type="button"
                    onClick={onRequestLocationPermission}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Detect Device GPS Location</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Doorbly never exposes your exact coordinates to third parties. GPS is strictly used to match nearby verified trade technicians in your municipality.
              </p>
            </div>
          )}

          {activeSection === 'legal' && (
            <div className="space-y-3">
              {!legalView ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLegalView('privacy')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Privacy Policy</div>
                      <div className="text-[11px] text-slate-500">How customer data and location are protected</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLegalView('terms')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Terms & Conditions</div>
                      <div className="text-[11px] text-slate-500">Doorstep service guarantees & pricing policy</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </button>
                </>
              ) : legalView === 'privacy' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Privacy Policy</h4>
                    <button
                      type="button"
                      onClick={() => setLegalView(null)}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                    <p><strong>1. Data Collection:</strong> We collect customer phone number, name, and service address purely to execute scheduled doorstep trade services in Odisha.</p>
                    <p><strong>2. GPS Location:</strong> Device location coordinates are used solely to allocate the closest verified technician and calculate transit times.</p>
                    <p><strong>3. Payment Safety:</strong> All card, UPI, and net banking transactions are processed through encrypted 256-bit bank payment gateways.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Terms of Service</h4>
                    <button
                      type="button"
                      onClick={() => setLegalView(null)}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                    <p><strong>1. Hourly Pricing:</strong> Standard billing is calculated per active hour with minimum 1-hour service duration.</p>
                    <p><strong>2. Technician Guarantee:</strong> Every technician is background verified and carries a Doorbly digital identity credential.</p>
                    <p><strong>3. Cancellation:</strong> Cancellations made before partner dispatch incur zero penalty fees.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
