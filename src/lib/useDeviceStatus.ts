import { useState, useEffect, useCallback, useRef } from 'react';
import { CustomerAddress } from '../types';
import { ODISHA_DISTRICTS, getNearestOdishaDistrict } from '../data/odishaLocations';

export interface RealNetworkStatus {
  isOnline: boolean;
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  downlink: number | null; // Mbps
  rtt: number | null; // ms round-trip time
  saveData: boolean;
  type: string;
  lastChanged: Date;
}

export interface RealGeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null; // m/s
  timestamp: number;
}

export interface RealLocationDetails {
  coords: RealGeoCoordinates | null;
  isLocating: boolean;
  isWatching: boolean;
  error: string | null;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unknown';
  localityName: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  fullAddress: string | null;
  lastUpdated: Date | null;
  isOdisha: boolean;
}

// Helper to find closest Odisha district from coordinates
function findClosestOdishaDistrict(lat: number, lng: number, detectedDistrict?: string, detectedCity?: string): string {
  if (detectedDistrict) {
    const match = ODISHA_DISTRICTS.find(d => 
      d.district.toLowerCase() === detectedDistrict.toLowerCase() ||
      detectedDistrict.toLowerCase().includes(d.district.toLowerCase()) ||
      d.district.toLowerCase().includes(detectedDistrict.toLowerCase())
    );
    if (match) return match.district;
  }
  if (detectedCity) {
    for (const d of ODISHA_DISTRICTS) {
      if (d.majorCities.some(c => c.toLowerCase() === detectedCity.toLowerCase() || detectedCity.toLowerCase().includes(c.toLowerCase()))) {
        return d.district;
      }
    }
  }
  return getNearestOdishaDistrict(lat, lng).district;
}

export function useDeviceStatus(onAutoUpdateAddress?: (address: CustomerAddress) => void) {
  // Store the callback in a ref to avoid infinite dependency churn
  const onAutoUpdateAddressRef = useRef(onAutoUpdateAddress);
  useEffect(() => {
    onAutoUpdateAddressRef.current = onAutoUpdateAddress;
  }, [onAutoUpdateAddress]);

  // 1. REAL NETWORK STATUS
  const getNetworkSnapshot = useCallback((): RealNetworkStatus => {
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const isOnline = nav ? nav.onLine : true;
    const connection = (nav as any)?.connection || (nav as any)?.mozConnection || (nav as any)?.webkitConnection;

    return {
      isOnline,
      effectiveType: connection?.effectiveType || (isOnline ? '4g' : 'unknown'),
      downlink: typeof connection?.downlink === 'number' ? connection.downlink : null,
      rtt: typeof connection?.rtt === 'number' ? connection.rtt : null,
      saveData: Boolean(connection?.saveData),
      type: connection?.type || (isOnline ? 'cellular/wifi' : 'none'),
      lastChanged: new Date()
    };
  }, []);

  const [networkStatus, setNetworkStatus] = useState<RealNetworkStatus>(getNetworkSnapshot);

  useEffect(() => {
    const updateNetwork = () => {
      setNetworkStatus(getNetworkSnapshot());
    };

    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const connection = (nav as any)?.connection || (nav as any)?.mozConnection || (nav as any)?.webkitConnection;

    if (connection && typeof connection.addEventListener === 'function') {
      connection.addEventListener('change', updateNetwork);
    }

    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      if (connection && typeof connection.removeEventListener === 'function') {
        connection.removeEventListener('change', updateNetwork);
      }
    };
  }, [getNetworkSnapshot]);

  // 2. REAL GEOLOCATION STATUS
  const [locationStatus, setLocationStatus] = useState<RealLocationDetails>({
    coords: null,
    isLocating: false,
    isWatching: false,
    error: null,
    permissionState: 'unknown',
    localityName: null,
    district: null,
    city: null,
    state: null,
    pincode: null,
    fullAddress: null,
    lastUpdated: null,
    isOdisha: true
  });

  const watchIdRef = useRef<number | null>(null);

  // Check initial permission status if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((permission) => {
          setLocationStatus(prev => ({
            ...prev,
            permissionState: permission.state as any
          }));
          permission.onchange = () => {
            setLocationStatus(prev => ({
              ...prev,
              permissionState: permission.state as any
            }));
          };
        })
        .catch(() => {
          // Permissions API query not supported for geolocation on all browsers
        });
    }
  }, []);

  // Reverse Geocoding with real device coordinates
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Doorbly-Doorstep-Services-Odisha/1.0'
          },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Geocoding service unavailable');
      const data = await response.json();
      
      const addr = data.address || {};
      const stateName = addr.state || 'Odisha';
      const isOdisha = stateName.toLowerCase().includes('odisha') || stateName.toLowerCase().includes('orissa');
      
      const rawCity = addr.city || addr.town || addr.municipality || addr.village || addr.suburb || 'Bhubaneswar';
      const rawDistrict = addr.state_district || addr.county || addr.district || 'Khordha';
      const matchedDistrict = findClosestOdishaDistrict(lat, lng, rawDistrict, rawCity);
      const locality = addr.neighbourhood || addr.suburb || addr.residential || addr.road || rawCity;
      const pincode = addr.postcode || '751024';
      const full = data.display_name || `${locality}, ${rawCity}, ${matchedDistrict}, Odisha`;

      return {
        localityName: locality,
        city: rawCity,
        district: matchedDistrict,
        state: isOdisha ? 'Odisha' : stateName,
        pincode,
        fullAddress: full,
        isOdisha
      };
    } catch {
      // Fallback to geometric nearest Odisha district center
      const nearest = getNearestOdishaDistrict(lat, lng);
      return {
        localityName: nearest.popularAreas[0] || `GPS Locality`,
        city: nearest.majorCities[0] || nearest.district,
        district: nearest.district,
        state: 'Odisha',
        pincode: nearest.pincodes[0] || '751001',
        fullAddress: `${nearest.popularAreas[0]}, ${nearest.majorCities[0]}, ${nearest.district}, Odisha`,
        isOdisha: true
      };
    }
  }, []);

  const handlePositionSuccess = useCallback(async (pos: GeolocationPosition, autoSync: boolean = true) => {
    const coords: RealGeoCoordinates = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: Math.round(pos.coords.accuracy),
      altitude: pos.coords.altitude !== null ? Math.round(pos.coords.altitude) : null,
      altitudeAccuracy: pos.coords.altitudeAccuracy !== null ? Math.round(pos.coords.altitudeAccuracy) : null,
      heading: pos.coords.heading !== null ? Math.round(pos.coords.heading) : null,
      speed: pos.coords.speed !== null ? Number(pos.coords.speed.toFixed(1)) : null,
      timestamp: pos.timestamp
    };

    const details = await reverseGeocode(coords.latitude, coords.longitude);

    setLocationStatus(prev => ({
      ...prev,
      coords,
      isLocating: false,
      error: null,
      permissionState: 'granted',
      localityName: details.localityName,
      city: details.city,
      district: details.district,
      state: details.state,
      pincode: details.pincode,
      fullAddress: details.fullAddress,
      isOdisha: details.isOdisha,
      lastUpdated: new Date()
    }));

    if (autoSync && onAutoUpdateAddressRef.current) {
      onAutoUpdateAddressRef.current({
        address_line: details.localityName ? `${details.localityName}, ${details.city}` : `GPS Point, ${details.city}`,
        area: details.localityName || details.city || 'Current Location',
        city: details.city,
        district: details.district,
        state: 'Odisha',
        pincode: details.pincode,
        latitude: coords.latitude,
        longitude: coords.longitude,
        is_default: true
      });
    }
  }, [reverseGeocode]);

  const handlePositionError = useCallback((err: GeolocationPositionError) => {
    let errorMsg = 'Failed to fetch device location.';
    let permState: 'prompt' | 'granted' | 'denied' | 'unknown' = 'unknown';

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMsg = 'Location permission was denied on this device. Please allow location access in browser settings.';
        permState = 'denied';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMsg = 'Device location signal is unavailable.';
        break;
      case err.TIMEOUT:
        errorMsg = 'Location acquisition timed out. Retrying...';
        break;
    }

    setLocationStatus(prev => ({
      ...prev,
      isLocating: false,
      error: errorMsg,
      permissionState: permState
    }));
  }, []);

  // Request single high-accuracy location fix
  const fetchRealLocation = useCallback((autoSync: boolean = true) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this device / browser.',
        isLocating: false
      }));
      return;
    }

    setLocationStatus(prev => ({ ...prev, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => handlePositionSuccess(pos, autoSync),
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000
      }
    );
  }, [handlePositionSuccess, handlePositionError]);

  // Start continuous live tracking
  const startLiveWatch = useCallback((autoSync: boolean = true) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setLocationStatus(prev => ({ ...prev, isWatching: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => handlePositionSuccess(pos, autoSync),
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      }
    );
  }, [handlePositionSuccess, handlePositionError]);

  const stopLiveWatch = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocationStatus(prev => ({ ...prev, isWatching: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Auto-request location from the user's device on initial load
  useEffect(() => {
    fetchRealLocation(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    networkStatus,
    locationStatus,
    fetchRealLocation,
    startLiveWatch,
    stopLiveWatch
  };
}
