import os
import subprocess
import shutil
import sys

def run(cmd, cwd=None):
    print(f"Running: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"FAILED (code {res.returncode}):\nSTDOUT: {res.stdout}\nSTDERR: {res.stderr}")
        sys.exit(1)
    if res.stdout:
        print(res.stdout)
    return res

BUILD_DIR = os.path.abspath("build-apk")
SRC_DIR = os.path.join(BUILD_DIR, "src/com/doorbly/app")
RES_DIR = os.path.join(BUILD_DIR, "res")
GEN_DIR = os.path.join(BUILD_DIR, "gen")
BIN_DIR = os.path.join(BUILD_DIR, "bin")
KEYSTORE = os.path.join(BUILD_DIR, "doorbly-release.keystore")

shutil.rmtree(BUILD_DIR, ignore_errors=True)
os.makedirs(SRC_DIR, exist_ok=True)
os.makedirs(GEN_DIR, exist_ok=True)
os.makedirs(BIN_DIR, exist_ok=True)
os.makedirs(os.path.join(RES_DIR, "values"), exist_ok=True)
os.makedirs(os.path.join(RES_DIR, "layout"), exist_ok=True)
os.makedirs(os.path.join(RES_DIR, "drawable"), exist_ok=True)

# Copy mipmap icons
for density in ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]:
    src_mip = f"android/app/src/main/res/mipmap-{density}"
    dst_mip = os.path.join(RES_DIR, f"mipmap-{density}")
    if os.path.exists(src_mip):
        shutil.copytree(src_mip, dst_mip)

# 1. Manifest
manifest_content = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.doorbly.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.DeviceDefault.Light.NoActionBar">

        <activity
            android:name="com.doorbly.app.MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="doorbly" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
with open(os.path.join(BUILD_DIR, "AndroidManifest.xml"), "w") as f:
    f.write(manifest_content)

# 2. Values & Layout
with open(os.path.join(RES_DIR, "values/strings.xml"), "w") as f:
    f.write("""<resources>
    <string name="app_name">Doorbly</string>
    <string name="web_url">https://ais-pre-d2zmozb67dgrf6ollqvwqv-955334821892.asia-southeast1.run.app</string>
</resources>""")

with open(os.path.join(RES_DIR, "values/colors.xml"), "w") as f:
    f.write("""<resources>
    <color name="primary">#4F46E5</color>
    <color name="white">#FFFFFF</color>
</resources>""")

with open(os.path.join(RES_DIR, "layout/activity_main.xml"), "w") as f:
    f.write("""<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:indeterminate="false"
        android:max="100"
        android:visibility="gone" />

    <LinearLayout
        android:id="@+id/offlineView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#FFFFFF"
        android:gravity="center"
        android:orientation="vertical"
        android:padding="32dp"
        android:visibility="gone">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Doorbly"
            android:textColor="#4F46E5"
            android:textSize="28sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="No Internet Connection"
            android:textColor="#1E293B"
            android:textSize="18sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:gravity="center"
            android:text="Please check your network connection and retry to access doorstep services in Odisha."
            android:textColor="#64748B"
            android:textSize="14sp" />

        <Button
            android:id="@+id/retryButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:text="Retry Now" />
    </LinearLayout>
</FrameLayout>""")

# 3. MainActivity.java
with open(os.path.join(SRC_DIR, "MainActivity.java"), "w") as f:
    f.write("""package com.doorbly.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

public class MainActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout offlineView;
    private Button retryButton;
    private ValueCallback<Uri[]> fileUploadCallback;

    private static final String APP_URL = "https://ais-pre-d2zmozb67dgrf6ollqvwqv-955334821892.asia-southeast1.run.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = (WebView) findViewById(R.id.webView);
        progressBar = (ProgressBar) findViewById(R.id.progressBar);
        offlineView = (LinearLayout) findViewById(R.id.offlineView);
        retryButton = (Button) findViewById(R.id.retryButton);

        setupWebView();

        retryButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isNetworkAvailable()) {
                    offlineView.setVisibility(View.GONE);
                    webView.setVisibility(View.VISIBLE);
                    webView.reload();
                }
            }
        });

        loadApp();
    }

    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " DoorblyAndroidApp/1.0.0");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                offlineView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                if (!isNetworkAvailable()) {
                    webView.setVisibility(View.GONE);
                    offlineView.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;
                String lower = url.toLowerCase();

                // Native external app links (UPI payments, phone calls, whatsapp)
                if (lower.startsWith("tel:") || lower.startsWith("mailto:") || lower.startsWith("sms:") || lower.startsWith("whatsapp:") || lower.startsWith("upi:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }

                if (url.contains("ais-pre-d2zmozb67dgrf6ollqvwqv") || url.contains("doorbly")) {
                    return false;
                }

                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress >= 100) {
                    progressBar.setVisibility(View.GONE);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                // Grant geolocation for customer booking address auto-locate in Odisha
                callback.invoke(origin, true, false);
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.setType("image/*");
                intent.addCategory(Intent.CATEGORY_OPENABLE);

                try {
                    startActivityForResult(Intent.createChooser(intent, "Select Picture"), 1001);
                    return true;
                } catch (Exception e) {
                    fileUploadCallback = null;
                    return false;
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1001 && fileUploadCallback != null) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                String dataString = data.getDataString();
                if (dataString != null) {
                    results = new Uri[]{Uri.parse(dataString)};
                }
            }
            fileUploadCallback.onReceiveValue(results);
            fileUploadCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    private void loadApp() {
        if (!isNetworkAvailable()) {
            webView.setVisibility(View.GONE);
            offlineView.setVisibility(View.VISIBLE);
            return;
        }
        webView.loadUrl(APP_URL);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        NetworkInfo info = cm.getActiveNetworkInfo();
        return info != null && info.isConnected();
    }
}
""")

ANDROID_JAR = "/usr/lib/android-sdk/platforms/android-23/android.jar"

# 4. Generate R.java with aapt
run(f"aapt package -f -m -J {GEN_DIR} -M {BUILD_DIR}/AndroidManifest.xml -S {RES_DIR} -I {ANDROID_JAR}")

# 5. Compile Java files with ecj
java_files = [
    os.path.join(GEN_DIR, "com/doorbly/app/R.java"),
    os.path.join(SRC_DIR, "MainActivity.java")
]
run(f"ecj -proc:none -7 -cp {ANDROID_JAR} -d {BIN_DIR} {' '.join(java_files)}")

# 6. Convert .class to classes.dex with dalvik-exchange
run(f"/usr/bin/dalvik-exchange --dex --output={BUILD_DIR}/classes.dex {BIN_DIR}")

# 7. Package APK with aapt
UNALIGNED_APK = os.path.join(BUILD_DIR, "app-unaligned.apk")
ALIGNED_APK = os.path.join(BUILD_DIR, "app-aligned.apk")
FINAL_APK = os.path.abspath("public/doorbly.apk")

run(f"aapt package -f -M {BUILD_DIR}/AndroidManifest.xml -S {RES_DIR} -I {ANDROID_JAR} -F {UNALIGNED_APK}")

# 8. Add classes.dex to APK
run(f"aapt add {UNALIGNED_APK} classes.dex", cwd=BUILD_DIR)

# 9. Zipalign APK
run(f"zipalign -f -p 4 {UNALIGNED_APK} {ALIGNED_APK}")

# 10. Generate Keystore if not exists
if not os.path.exists(KEYSTORE):
    run(f"keytool -genkey -v -keystore {KEYSTORE} -keyalg RSA -keysize 2048 -validity 10000 -alias doorbly -storepass doorbly123 -keypass doorbly123 -dname 'CN=Doorbly, OU=Engineering, O=Doorbly Technologies, L=Bhubaneswar, ST=Odisha, C=IN'")

# 11. Sign APK with apksigner
shutil.copyfile(ALIGNED_APK, FINAL_APK)
run(f"apksigner sign --ks {KEYSTORE} --ks-pass pass:doorbly123 --ks-key-alias doorbly --key-pass pass:doorbly123 {FINAL_APK}")

# 12. Verify APK signature
run(f"apksigner verify --verbose {FINAL_APK}")

print(f"\nSUCCESS! Direct APK built and signed at: {FINAL_APK}")
print(f"File size: {os.path.getsize(FINAL_APK)} bytes")
