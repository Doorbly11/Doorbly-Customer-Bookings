import React, { useState } from 'react';
import { CustomerAddress } from '../types';
import { ODISHA_DISTRICTS, getNearestOdishaDistrict } from '../data/odishaLocations';
import { MapPin, Navigation, Check, X, Sparkles, CheckCircle2, LocateFixed } from 'lucide-react';

interface OdishaLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: CustomerAddress;
  onSelectAddress: (address: CustomerAddress) => void;
}

export const OdishaLocationModal: React.FC<OdishaLocationModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentAddress.district || 'Khordha');
  const [city, setCity] = useState<string>(currentAddress.city || 'Bhubaneswar');
  const [area, setArea] = useState<string>(currentAddress.area || 'Saheed Nagar');
  const [addressLine, setAddressLine] = useState<string>(currentAddress.address_line || '');
  const [pincode, setPincode] = useState<string>(currentAddress.pincode || '751007');
  const [geoCoords, setGeoCoords] = useState<{ lat?: number; lng?: number; accuracy?: number }>({
    lat: currentAddress.latitude || undefined,
    lng: currentAddress.longitude || undefined,
    accuracy: undefined
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!isOpen) return null;

  const currentDistrictData = ODISHA_DISTRICTS.find(d => d.district === selectedDistrict) || ODISHA_DISTRICTS[0];

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const dData = ODISHA_DISTRICTS.find(d => d.district === distName);
    if (dData) {
      setCity(dData.majorCities[0] || distName);
      setArea(dData.popularAreas[0] || 'Main Town');
      setPincode(dData.pincodes[0] || '751001');
    }
  };

  const handleDetectRealDeviceGPS = (autoApply: boolean = false) => {
    if (!navigator.geolocation) {
      setLocationMessage({ text: "Browser geolocation is not supported on this device.", type: 'error' });
      return;
    }
    setIsLocating(true);
    setLocationMessage({ text: "Acquiring real-time GPS satellite fix from device...", type: 'info' });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);

        setGeoCoords({ lat, lng, accuracy });

        let resolvedCity = city;
        let resolvedArea = area;
        let resolvedDistrict = selectedDistrict;
        let resolvedPin = pincode;

        // Real-time reverse geocoding via OpenStreetMap with timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Doorbly-Customer-Portal/1.0'
              },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (resp.ok) {
            const data = await resp.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.municipality || addr.village || addr.suburb;
            const detectedDistrictRaw = addr.state_district || addr.county || addr.district;
            const detectedLocality = addr.neighbourhood || addr.suburb || addr.residential || addr.road;
            const detectedPostcode = addr.postcode;

            if (detectedCity) resolvedCity = detectedCity;
            if (detectedLocality) resolvedArea = detectedLocality;
            if (detectedPostcode) resolvedPin = detectedPostcode;

            // Match district with Odisha dataset
            if (detectedDistrictRaw) {
              const matched = ODISHA_DISTRICTS.find(d => 
                d.district.toLowerCase() === detectedDistrictRaw.toLowerCase() ||
                detectedDistrictRaw.toLowerCase().includes(d.district.toLowerCase()) ||
                d.district.toLowerCase().includes(detectedDistrictRaw.toLowerCase())
              );
              if (matched) resolvedDistrict = matched.district;
              else resolvedDistrict = getNearestOdishaDistrict(lat, lng).district;
            } else {
              resolvedDistrict = getNearestOdishaDistrict(lat, lng).district;
            }

            setLocationMessage({
              text: `Device GPS Detected: ${resolvedArea}, ${resolvedCity} (${lat}°, ${lng}°) • ±${accuracy}m accuracy`,
              type: 'success'
            });
          } else {
            throw new Error("Geocoding service unavailable");
          }
        } catch {
          const nearest = getNearestOdishaDistrict(lat, lng);
          resolvedDistrict = nearest.district;
          resolvedCity = nearest.majorCities[0] || nearest.district;
          resolvedArea = nearest.popularAreas[0] || 'Current Location';
          resolvedPin = nearest.pincodes[0] || '751001';

          setLocationMessage({
            text: `GPS coordinates acquired (${lat}°, ${lng}°) • Matched to ${nearest.district}, Odisha (±${accuracy}m)`,
            type: 'success'
          });
        } finally {
          setIsLocating(false);
          setCity(resolvedCity);
          setArea(resolvedArea);
          setSelectedDistrict(resolvedDistrict);
          setPincode(resolvedPin);
          if (!addressLine.trim()) {
            setAddressLine(`${resolvedArea}, ${resolvedCity}`);
          }

          if (autoApply) {
            const autoAddr: CustomerAddress = {
              address_line: `${resolvedArea}, ${resolvedCity}`,
              area: resolvedArea,
              city: resolvedCity,
              district: resolvedDistrict,
              state: 'Odisha',
              pincode: resolvedPin,
              latitude: lat,
              longitude: lng,
              is_default: true
            };
            onSelectAddress(autoAddr);
            onClose();
          }
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = "Unable to retrieve device GPS. Please check location permissions.";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission denied in browser. Please enable location access in browser settings.";
        }
        setLocationMessage({ text: msg, type: 'error' });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CustomerAddress = {
      address_line: addressLine.trim() || `${area}, ${city}`,
      area: area.trim(),
      city: city.trim(),
      district: selectedDistrict,
      state: 'Odisha',
      pincode: pincode.trim() || currentDistrictData.pincodes[0] || '751001',
      latitude: geoCoords.lat || null,
      longitude: geoCoords.lng || null,
      is_default: true
    };
    onSelectAddress(updated);
    onClose();
  };

  // Quick select cities
  const popularHubs = [
    { name: "Bhubaneswar", district: "Khordha", area: "Saheed Nagar", pin: "751007" },
    { name: "Cuttack", district: "Cuttack", area: "CDA Sector 6", pin: "753014" },
    { name: "Puri", district: "Puri", area: "Grand Road", pin: "752001" },
    { name: "Rourkela", district: "Sundargarh", area: "Civil Township", pin: "769004" },
    { name: "Berhampur", district: "Ganjam", area: "Bhavani Nagar", pin: "760004" },
    { name: "Sambalpur", district: "Sambalpur", area: "Budharaja", pin: "768004" },
    { name: "Balasore", district: "Balasore", area: "Sahadevkhunta", pin: "756001" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-location-modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Service Location</h2>
            <p className="text-xs text-slate-500 font-medium">Auto-detect from your device GPS or select any Odisha district</p>
          </div>
        </div>

        {/* Real Device GPS Quick Capture Banner */}
        <div className="mb-5 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-green-50 text-slate-900 rounded-2xl p-4 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-900 tracking-wide">Device Hardware GPS</span>
            </div>
            {geoCoords.accuracy && (
              <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                ±{geoCoords.accuracy}m Accuracy
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-detect-real-gps"
              onClick={() => handleDetectRealDeviceGPS(false)}
              disabled={isLocating}
              className="w-full py-2.5 px-3 bg-white hover:bg-emerald-50 active:scale-98 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Detect Device GPS'}</span>
            </button>

            <button
              type="button"
              id="btn-detect-apply-gps"
              onClick={() => handleDetectRealDeviceGPS(true)}
              disabled={isLocating}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <LocateFixed className="w-3.5 h-3.5 text-white" />
              <span>Detect & Apply Now</span>
            </button>
          </div>

          {locationMessage && (
            <div className={`mt-2.5 p-2.5 rounded-xl text-xs leading-relaxed flex items-start gap-2 ${
              locationMessage.type === 'success'
                ? 'bg-emerald-100/80 border border-emerald-300 text-emerald-900'
                : locationMessage.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-white/80 border border-emerald-200 text-emerald-800'
            }`}>
              {locationMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <span className="text-[11px] font-medium">{locationMessage.text}</span>
            </div>
          )}
        </div>

        {/* Quick Hub Selector */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Popular Odisha Hubs
          </label>
          <div className="flex flex-wrap gap-1.5">
            {popularHubs.map(hub => {
              const isSelected = selectedDistrict === hub.district && city === hub.name;
              return (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => {
                    setSelectedDistrict(hub.district);
                    setCity(hub.name);
                    setArea(hub.area);
                    setPincode(hub.pin);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {hub.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select District (Odisha)
            </label>
            <select
              id="select-district"
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 cursor-pointer"
            >
              {ODISHA_DISTRICTS.map(d => (
                <option key={d.district} value={d.district}>
                  {d.district} District
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Town
              </label>
              <input
                type="text"
                id="input-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bhubaneswar"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                id="input-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Patia / Saheed Nagar"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Doorstep Address Line (House / Flat / Street)
            </label>
            <input
              type="text"
              id="input-address-line"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="e.g. Plot No. 124, Near Big Bazaar, Lane 3"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Postal PIN Code
              </label>
              <input
                type="text"
                id="input-pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 751024"
                maxLength={6}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value="Odisha, India"
                disabled
                className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="btn-confirm-location"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Service Location</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

