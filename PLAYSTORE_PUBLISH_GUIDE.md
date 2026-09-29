# Doorbly Google Play Store Upload & Release Guide

This document contains everything you need to build, sign, and upload the **Doorbly Android Application** directly to the **Google Play Store**.

---

## 1. Quick Summary of Android App Configuration

- **Application ID / Package Name**: `com.doorbly.app`
- **Target SDK**: `34` (Android 14 — Fully compliant with Google Play 2024–2026 requirements)
- **Minimum SDK**: `24` (Android 7.0+ Nougat — covers 98%+ of active Android devices)
- **Version Code**: `1`
- **Version Name**: `1.0.0`
- **Primary Color**: `#4F46E5` (Indigo)
- **Launcher Icons**: Generated and placed in `android/app/src/main/res/mipmap-*` (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- **PWA Icons**: Located at `public/pwa-192x192.png`, `public/pwa-512x512.png`, and `public/pwa-maskable-512x512.png`
- **Digital Asset Links**: Configured at `public/.well-known/assetlinks.json`

---

## 2. Option A: Building with Android Studio (Recommended)

1. **Open the Project in Android Studio**:
   - Open Android Studio.
   - Select **Open** and choose the `android` folder in this repository.
   - Wait for Gradle sync to complete.

2. **Generate Release Keystore**:
   In your terminal, navigate to the `android/app` directory and generate your release key:
   ```bash
   keytool -genkey -v -keystore doorbly-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias doorbly -storetype JKS
   ```
   *(Keep this `.jks` file secure and remember the passwords!)*

3. **Build the Signed Android App Bundle (.aab)**:
   - In Android Studio, go to the top menu: **Build** -> **Generate Signed Bundle / APK...**
   - Select **Android App Bundle** and click **Next**.
   - Point to your `doorbly-release-key.jks`, enter your password, alias `doorbly`, and key password.
   - Select Destination Folder and build variant **release**.
   - Click **Finish**.
   - Your `.aab` file will be generated in `android/app/release/app-release.aab`.

---

## 3. Option B: Instant Build via Google Bubblewrap CLI (TWA)

Google's official `bubblewrap` tool uses the included `android/twa-manifest.json`:

```bash
# 1. Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Build the Android App Bundle
cd android
bubblewrap build
```
This directly outputs `app-release-bundle.aab` ready for upload to Google Play Console.

---

## 4. Digital Asset Links Verification (Important)

Google Play checks domain verification so the browser URL bar is hidden and the app runs in full native mode.

1. Get your SHA-256 fingerprint from your keystore:
   ```bash
   keytool -list -v -keystore doorbly-release-key.jks -alias doorbly
   ```
2. Copy the `SHA256: XX:XX:XX:...` fingerprint.
3. If using Google Play App Signing (recommended), copy the SHA-256 fingerprint from **Google Play Console** -> **Your App** -> **Setup** -> **App Signing**.
4. Update `public/.well-known/assetlinks.json` with this fingerprint.

---

## 5. Google Play Console Upload Checklist

1. **Create App**:
   - Go to [Google Play Console](https://play.google.com/console).
   - Click **Create app**.
   - Name: `Doorbly - Home Services in Odisha`
   - Default language: English (United States / India)
   - App or game: **App**
   - Free or paid: **Free**

2. **Store Listing Details**:
   - **Short description** (max 80 chars):
     *Instant hourly booking for verified electricians, plumbers & home services in Odisha.*
   - **Full description**:
     *Doorbly is Odisha's premier doorstep service platform. Book verified electricians, plumbers, appliance technicians, home cleaners, and carpenters in minutes with hourly transparent pricing and real-time partner tracking.*
   - **App icon**: 512x512 PNG (`public/pwa-512x512.png`).
   - **Feature graphic**: 1024x500 JPG or PNG.
   - **Phone Screenshots**: At least 4 screenshots (Home screen, Services catalog, Booking flow, Track partner).

3. **App Content Declarations**:
   - **Privacy Policy**: Set your privacy policy URL (e.g. `https://your-domain/privacy` or use the in-app policy).
   - **App access**: All functionality is available without special restrictions.
   - **Ads**: Select "No, my app does not contain ads".
   - **Content rating**: Complete the questionnaire (Utilities/Service app -> Everyone).
   - **Target audience**: 18 and older.
   - **Location permissions**: Declare "Location is used to locate customer address for verified technician dispatch".

4. **Upload the Bundle (.aab)**:
   - Navigate to **Production** (or **Closed Testing** for initial QA).
   - Click **Create new release**.
   - Drag & drop your `app-release.aab` file.
   - Review release details and click **Save** -> **Review release** -> **Start rollout to Production**!

---

## 6. Support & Permissions

The Android application requests the following runtime permissions:
- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`: To accurately locate service addresses in Bhubaneswar, Cuttack, Puri, Rourkela, and across Odisha.
- `CAMERA`: To upload photos or videos of repairs needed during booking.
- `INTERNET`: To communicate with the Doorbly real-time booking engine and Supabase backend.
