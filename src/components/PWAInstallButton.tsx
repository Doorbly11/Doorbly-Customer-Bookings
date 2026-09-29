import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenPlayStoreHub?: () => void;
  className?: string;
  variant?: 'navbar' | 'compact' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  onOpenPlayStoreHub, 
  className = '',
  variant = 'navbar'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone
  if (isInstalled) {
    if (variant === 'drawer') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Android App Active</span>
        </div>
      );
    }
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else if (onOpenPlayStoreHub) {
      onOpenPlayStoreHub();
    } else {
      alert('To install on your mobile device, open browser menu and select "Install App" or "Add to Home Screen".');
    }
  };

  if (variant === 'drawer') {
    return (
      <>
        <button
          onClick={handleAction}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm hover:from-indigo-700 hover:to-cyan-700 transition ${className}`}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Smartphone className="w-4 h-4" />
            <span>Install Android App</span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">Free</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button (square with arrow) in Safari.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> to complete installation.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleAction}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 hover:border-indigo-300 transition shadow-sm ${className}`}
        title="Install Android App"
      >
        <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden sm:inline">Get App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              1. Tap the <strong>Share</strong> button in Safari.<br />
              2. Scroll down and select <strong>Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
