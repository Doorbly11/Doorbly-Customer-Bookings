import React, { useState } from 'react';
import { CustomerProfile } from '../types';
import { getSupabaseClient, syncCustomerProfile, generateStandardUuid } from '../lib/supabase';
import { ADMIN_EMAIL, ADMIN_PASSWORD, verifyAdminCredentials, setAdminSession } from '../lib/adminStore';
import { User, Mail, Phone, Lock, Check, X, AlertCircle, LogIn, LogOut, UserPlus, Shield } from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: CustomerProfile;
  onProfileUpdated: (profile: CustomerProfile) => void;
  onLogout?: () => void;
  onAdminLogin?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  onProfileUpdated,
  onLogout,
  onAdminLogin
}) => {
  if (!isOpen) return null;

  const isLoggedIn = !!(customerProfile.is_logged_in || customerProfile.auth_user_id || customerProfile.full_name);
  const [mode, setMode] = useState<'profile' | 'signin' | 'signup'>(isLoggedIn ? 'profile' : 'signin');
  const [fullName, setFullName] = useState<string>(customerProfile.full_name || '');
  const [email, setEmail] = useState<string>(customerProfile.email || '');
  const [phone, setPhone] = useState<string>(customerProfile.phone || '');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setSuccessMsg(null);

    try {
      if (!fullName.trim()) {
        throw new Error("Please enter your full name.");
      }
      if (!phone.trim()) {
        throw new Error("Please enter your mobile phone number.");
      }

      const updated: CustomerProfile = {
        ...customerProfile,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        is_logged_in: true
      };

      const result = await syncCustomerProfile(updated);
      onProfileUpdated(result);
      setSuccessMsg("Customer profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setAuthError(err?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupabaseSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setAuthError("Please enter your full name.");
      setIsLoading(false);
      return;
    }
    if (!cleanPhone) {
      setAuthError("Please enter your mobile phone number.");
      setIsLoading(false);
      return;
    }

    // Check if entered credentials match Admin credentials
    if (verifyAdminCredentials(cleanEmail, cleanPassword)) {
      setAdminSession(true);
      const adminProfile: CustomerProfile = {
        id: 'admin-debabrata',
        full_name: cleanName || 'Debabrata Mohapatra (Admin)',
        email: ADMIN_EMAIL,
        phone: cleanPhone || '+91 94370 12345',
        is_logged_in: true
      };
      await syncCustomerProfile(adminProfile);
      onProfileUpdated(adminProfile);
      setSuccessMsg("Admin credentials verified! Opening Admin Panel...");
      setTimeout(() => {
        onClose();
        if (onAdminLogin) {
          onAdminLogin();
        }
      }, 400);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone
          }
        }
      });

      if (error) throw error;

      const profile: CustomerProfile = {
        id: data.user?.id || generateStandardUuid(),
        auth_user_id: data.user?.id,
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        is_logged_in: true
      };

      await syncCustomerProfile(profile);
      onProfileUpdated(profile);
      setSuccessMsg("Account registered successfully! Welcome to Doorbly.");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setAuthError(err?.message || "Registration failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupabaseSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Check if entered credentials match Admin credentials: debabrata.tribune@gmail.com / Devraj@1122
    if (verifyAdminCredentials(cleanEmail, cleanPassword)) {
      setAdminSession(true);
      const adminProfile: CustomerProfile = {
        id: 'admin-debabrata',
        full_name: 'Debabrata Mohapatra (Admin)',
        email: ADMIN_EMAIL,
        phone: phone.trim() || '',
        is_logged_in: true
      };
      await syncCustomerProfile(adminProfile);
      onProfileUpdated(adminProfile);
      setSuccessMsg("Admin credentials verified! Opening Admin Control Panel...");
      setTimeout(() => {
        onClose();
        if (onAdminLogin) {
          onAdminLogin();
        }
      }, 400);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        throw error;
      }

      const profile: CustomerProfile = {
        id: data.user?.id || generateStandardUuid(),
        auth_user_id: data.user?.id,
        full_name: data.user?.user_metadata?.full_name || cleanEmail.split('@')[0],
        email: data.user?.email || cleanEmail,
        phone: data.user?.user_metadata?.phone || '',
        is_logged_in: true
      };

      await syncCustomerProfile(profile);
      onProfileUpdated(profile);
      setSuccessMsg("Signed in successfully!");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setAuthError(err?.message || "Sign in failed. Check email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePerformLogout = async () => {
    setAdminSession(false);
    try {
      await supabase.auth.signOut();
    } catch {}
    if (onLogout) {
      onLogout();
    } else {
      const guestProfile: CustomerProfile = {
        id: generateStandardUuid(),
        full_name: '',
        email: '',
        phone: '',
        is_logged_in: false
      };
      onProfileUpdated(guestProfile);
    }
    setSuccessMsg("Logged out successfully.");
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold shadow-xs">
            {mode === 'profile' ? <User className="w-5 h-5" /> : mode === 'signin' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'profile' ? 'Customer Account' : mode === 'signin' ? 'Customer Sign In' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Doorbly Customer Portal (Odisha)</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Register
          </button>
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setMode('profile')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'profile' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Profile Info
            </button>
          )}
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 mb-4">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Update Form */}
        {mode === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone (for Booking OTPs)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-mono text-slate-900"
              />
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={handlePerformLogout}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl transition-all border border-rose-200 flex items-center gap-1.5 cursor-pointer"
                title="Log Out of Customer Account"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </form>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSupabaseSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Customer Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Signing In...' : 'Sign In to Doorbly'}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Create one here
                </button>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Login Supported</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail(ADMIN_EMAIL);
                  setPassword('Devraj@1122');
                  setAuthError(null);
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                title="Fill Admin Credentials"
              >
                Auto-fill Admin
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSupabaseSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Phone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Set Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Creating Account...' : 'Register as Customer'}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

