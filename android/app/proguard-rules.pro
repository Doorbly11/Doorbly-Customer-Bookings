# ProGuard rules for Doorbly Android app
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class androidx.browser.customtabs.** { *; }
-dontwarn androidx.webkit.**
