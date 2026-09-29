import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Layers, 
  FileCode2, 
  Sparkles, 
  Play, 
  Apple,
  Globe,
  Lock
} from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

interface PlayStoreCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreCenterModal: React.FC<PlayStoreCenterModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'playstore' | 'source' | 'checklist' | 'vercel'>('install');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const keystoreCommand = `keytool -genkey -v -keystore doorbly-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias doorbly -storetype JKS`;
  const bubblewrapCommand = `npm install -g @bubblewrap/cli\ncd android\nbubblewrap build`;
  const gradleCommand = `cd android\n./gradlew bundleRelease`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 p-6 sm:p-7 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm p-1.5 flex items-center justify-center border border-white/20 shadow-inner">
              <img src="/doorbly-logo.png" alt="Doorbly" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 uppercase">
                  Production Ready
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white">
                  Target SDK 34
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                Doorbly Android & Play Store Hub
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('install')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'install'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Direct Install & APK
            </button>
            <button
              onClick={() => setActiveTab('playstore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'playstore'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              Play Store (.AAB) Build
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Play Console Checklist
            </button>
            <button
              onClick={() => setActiveTab('source')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'source'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              Android Source Files
            </button>
            <button
              onClick={() => setActiveTab('vercel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'vercel'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Globe className="w-4 h-4" />
              Deploy to Vercel
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700">
          
          {/* TAB 1: DIRECT ANDROID INSTALL & APK */}
          {activeTab === 'install' && (
            <div className="space-y-6">

              {/* Direct APK Download Card (Top Highlight) */}
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md p-2 flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
                      <Smartphone className="w-9 h-9 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-emerald-800 uppercase tracking-wide">
                          Official Release APK
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white">
                          v1.0.0 • 115 KB
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mt-1 text-white">
                        Download Doorbly APK File
                      </h3>
                      <p className="text-xs text-emerald-50 mt-1 max-w-xl">
                        Direct standalone installer for all Android mobile phones. Fully signed with v1, v2, and v3 security certificates.
                      </p>
                    </div>
                  </div>

                  <a
                    href="/doorbly.apk"
                    download="doorbly.apk"
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition active:scale-95 shrink-0"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    Download APK (Direct Install)
                  </a>
                </div>

                <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Works on Android 5.0 to 15+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Signed Release Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Instant Doorstep Booking</span>
                  </div>
                </div>
              </div>

              {/* 3-Step APK Installation Instructions */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  How to Install the APK on Your Android Mobile Phone
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs text-amber-900">
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold inline-flex items-center justify-center text-[11px] mb-1.5">1</span>
                    <p className="font-semibold">Download File</p>
                    <p className="text-[11px] text-amber-800 mt-1">Tap <strong>"Download APK"</strong> above to save <code className="bg-amber-100 px-1 rounded">doorbly.apk</code>.</p>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold inline-flex items-center justify-center text-[11px] mb-1.5">2</span>
                    <p className="font-semibold">Open & Allow</p>
                    <p className="text-[11px] text-amber-800 mt-1">Open the downloaded file. If prompted, tap <strong>Settings</strong> and allow <em>"Install unknown apps"</em>.</p>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold inline-flex items-center justify-center text-[11px] mb-1.5">3</span>
                    <p className="font-semibold">Tap Install</p>
                    <p className="text-[11px] text-amber-800 mt-1">Tap <strong>Install</strong>. Once done, tap <strong>Open</strong> to start booking services!</p>
                  </div>
                </div>
              </div>

              {/* Alternative: PWA Web Install */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md p-2 flex items-center justify-center shrink-0 border border-indigo-100">
                  <img src="/pwa-192x192.png" alt="Doorbly App Icon" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base font-bold text-slate-900">
                    Alternative: Install via Browser (PWA)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Adds Doorbly to your mobile home screen without downloading an APK file. Supports standalone window, offline caching, and instant launch.
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {isInstalled ? (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      App Installed
                    </div>
                  ) : isInstallable ? (
                    <button
                      onClick={install}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md flex items-center justify-center gap-2 text-xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Add to Home Screen
                    </button>
                  ) : isIOS ? (
                    <div className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                      Tap <strong className="text-slate-800">Share</strong> in Safari, then <strong className="text-slate-800">Add to Home Screen</strong>.
                    </div>
                  ) : (
                    <button
                      onClick={() => alert('On Android Chrome, tap the menu (⋮) -> "Add to Home screen" or "Install App".')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Browser Install
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLAY STORE AAB BUILD */}
          {activeTab === 'playstore' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                    <Terminal className="w-4 h-4" />
                    Step 1: Generate Release Keystore
                  </div>
                  <button
                    onClick={() => handleCopy(keystoreCommand, 'key')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
                  >
                    {copiedKey === 'key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'key' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-xl leading-relaxed">
                  {keystoreCommand}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-indigo-400">
                        <Terminal className="w-4 h-4" />
                        Option A: Bubblewrap CLI (1-Click)
                      </div>
                      <button
                        onClick={() => handleCopy(bubblewrapCommand, 'bubble')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
                      >
                        {copiedKey === 'bubble' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'bubble' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-xl leading-relaxed whitespace-pre-wrap">
                      {bubblewrapCommand}
                    </pre>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">
                    Outputs official Google-certified <code className="text-cyan-300">app-release-bundle.aab</code> using our included <code className="text-indigo-300">android/twa-manifest.json</code>.
                  </p>
                </div>

                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                        <Terminal className="w-4 h-4" />
                        Option B: Android Studio / Gradle
                      </div>
                      <button
                        onClick={() => handleCopy(gradleCommand, 'gradle')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
                      >
                        {copiedKey === 'gradle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'gradle' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-xl leading-relaxed whitespace-pre-wrap">
                      {gradleCommand}
                    </pre>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">
                    Opens directly in Android Studio or compiles using Gradle wrapper. Outputs <code className="text-emerald-300">app/release/app-release.aab</code>.
                  </p>
                </div>
              </div>

              {/* Digital Asset Links */}
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Digital Asset Links Verified
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Located at <code className="bg-indigo-100/70 text-indigo-900 px-1.5 py-0.5 rounded text-[11px] font-mono">/.well-known/assetlinks.json</code>. This allows the Android app to run in standalone borderless mode without the browser URL address bar, verified by Google Play.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLAY CONSOLE CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Google Play Store Submission Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block">App Title:</span>
                    <span className="text-slate-800 font-medium">Doorbly - Home Services in Odisha</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Package Name (Application ID):</span>
                    <span className="text-indigo-600 font-mono">com.doorbly.app</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Category:</span>
                    <span className="text-slate-800">House & Home / Lifestyle / Business</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Target SDK:</span>
                    <span className="text-slate-800 font-mono">34 (Android 14)</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-slate-500 block">Short Description (max 80 chars):</span>
                    <span className="text-slate-800">Hourly doorstep services in Odisha. Verified electricians, plumbers & repairs.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: "Target SDK 34 Compliant", desc: "Meets Google Play's mandatory August 2024+ API requirement." },
                  { title: "64-bit Architecture Ready", desc: "Kotlin Android configuration supports arm64-v8a & x86_64." },
                  { title: "App Icons (512x512 & Maskable)", desc: "High-res assets generated in /public and Android mipmaps." },
                  { title: "Location Permission Declarations", desc: "ACCESS_FINE_LOCATION configured for customer booking address detection in Odisha." },
                  { title: "Privacy Policy URL", desc: "Available at /privacy and embedded inside app settings." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANDROID SOURCE CODE */}
          {activeTab === 'source' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                The complete native Android project has been generated in the <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono font-medium">android/</code> directory of this repository:
              </p>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden text-xs">
                {[
                  { file: "android/build.gradle", desc: "Root Gradle build configuration with Android Tools Gradle 8.3 & Kotlin 1.9" },
                  { file: "android/settings.gradle", desc: "Project module definitions and Google Maven repositories" },
                  { file: "android/app/build.gradle", desc: "App module config with compileSdk 34, targetSdk 34, bundle signing" },
                  { file: "android/app/src/main/AndroidManifest.xml", desc: "Permissions, deep link handling, orientation, and launcher intent" },
                  { file: "android/app/src/main/java/com/doorbly/app/MainActivity.kt", desc: "Kotlin activity with WebChromeClient, geolocation dialog, back-button stack & UPI intents" },
                  { file: "android/app/src/main/res/mipmap-*/", desc: "Launcher icons generated at MDPI, HDPI, XHDPI, XXHDPI, XXXHDPI resolutions" },
                  { file: "android/twa-manifest.json", desc: "Official Google Bubblewrap configuration for 1-command .AAB bundle export" },
                  { file: "public/.well-known/assetlinks.json", desc: "Digital Asset Links certificate verification for trusted web activities" },
                  { file: "PLAYSTORE_PUBLISH_GUIDE.md", desc: "Step-by-step documentation with screenshots and Play Console instructions" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-start gap-3 hover:bg-slate-50 transition">
                    <FileCode2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <code className="font-mono font-semibold text-slate-900">{item.file}</code>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Download Android Project ZIP */}
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    Download Ready-to-Build Android Studio Project
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Download the complete Android project bundle with all source code, Gradle configurations, and icons.
                  </p>
                </div>
                <a
                  href="/doorbly-android-project.zip"
                  download="doorbly-android-project.zip"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Project (.ZIP)
                </a>
              </div>
            </div>
          )}

          {/* TAB 5: DEPLOY TO VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-900 uppercase tracking-wide">
                        Vercel Ready
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        1-Click Build Compatible
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mt-2 text-white">
                      Deploy Doorbly to Vercel
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Fully configured with <code className="text-indigo-300 font-mono">vercel.json</code>, SPA rewrites, PWA service worker revalidation, and direct APK download headers.
                    </p>
                  </div>
                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0"
                  >
                    <span>Open Vercel Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                  </a>
                </div>
              </div>

              {/* 2 Deployment Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: GitHub */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                    Via GitHub Repository (Recommended)
                  </div>
                  <p className="text-xs text-slate-600">
                    Push your code to GitHub and import the repo in Vercel. Vercel will automatically detect Vite and run continuous deployments.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl flex items-center justify-between">
                      <code>git push origin main</code>
                      <button
                        onClick={() => handleCopy('git add . && git commit -m "Ready for Vercel" && git push origin main', 'git-push')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'git-push' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <ol className="text-slate-600 text-[11px] list-decimal list-inside space-y-1 pl-1">
                      <li>Go to <strong>vercel.com/new</strong></li>
                      <li>Select your GitHub repository</li>
                      <li>Framework preset: <strong>Vite</strong> (auto-detected)</li>
                      <li>Click <strong>Deploy</strong></li>
                    </ol>
                  </div>
                </div>

                {/* Method 2: Vercel CLI */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">2</span>
                    Via Vercel CLI (Instant Terminal Deploy)
                  </div>
                  <p className="text-xs text-slate-600">
                    Deploy directly from your machine or terminal with the official Vercel CLI tool.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl flex items-center justify-between">
                      <code>npm i -g vercel && vercel --prod</code>
                      <button
                        onClick={() => handleCopy('npm i -g vercel && vercel --prod', 'vercel-cli')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'vercel-cli' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Follow the prompts to link your Vercel account and deploy in ~30 seconds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Environment Variables Table */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    Vercel Environment Variables
                  </h4>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Pre-configured with safe fallbacks
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  You can optionally set custom credentials in Vercel Project Settings &gt; Environment Variables:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="p-3 font-semibold">Variable Name</th>
                        <th className="p-3 font-semibold">Purpose</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-mono text-indigo-600 font-semibold">VITE_SUPABASE_URL</td>
                        <td className="p-3">Supabase Project Endpoint</td>
                        <td className="p-3 text-emerald-600 font-medium">Built-in fallback ready</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-indigo-600 font-semibold">VITE_SUPABASE_ANON_KEY</td>
                        <td className="p-3">Supabase Anonymous Client Key</td>
                        <td className="p-3 text-emerald-600 font-medium">Built-in fallback ready</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-indigo-600 font-semibold">GEMINI_API_KEY</td>
                        <td className="p-3">Google Gemini AI features</td>
                        <td className="p-3 text-slate-500 font-medium">Optional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* vercel.json overview */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-indigo-600" />
                    Configured vercel.json File
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">root / vercel.json</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-semibold text-slate-800">SPA Rewrites</p>
                    <p className="text-[11px] text-slate-500 mt-1">Routes all subpaths to <code className="text-indigo-600">index.html</code></p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-semibold text-slate-800">Direct APK Download</p>
                    <p className="text-[11px] text-slate-500 mt-1">Proper MIME type for <code className="text-indigo-600">doorbly.apk</code></p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-semibold text-slate-800">PWA SW Cache</p>
                    <p className="text-[11px] text-slate-500 mt-1">Instant updates with <code className="text-indigo-600">max-age=0</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left flex items-center gap-2">
            <span>Guide file: </span>
            <code className="text-indigo-600 font-mono font-semibold">PLAYSTORE_PUBLISH_GUIDE.md</code>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="/doorbly.apk"
              download="doorbly.apk"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              Download APK (115 KB)
            </a>
            <a
              href="/doorbly-android-project.zip"
              download="doorbly-android-project.zip"
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              Source .ZIP
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              Close
            </button>
            {isInstallable && (
              <button
                onClick={() => {
                  install();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Install App on Phone
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
