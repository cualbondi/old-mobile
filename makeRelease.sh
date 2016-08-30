rm -rf android-release-signed-aligned.apk
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore deploy_keys/android.keystore -storepass ***REMOVED*** platforms/android/build/outputs/apk/android-release-unsigned.apk release
mv platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/android-release-signed.apk
zipalign -v 4 platforms/android/build/outputs/apk/android-release-signed.apk android-release-signed-aligned.apk
