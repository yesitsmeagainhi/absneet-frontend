# Poppins Font Setup

## Download Font Files

Download the Poppins font family from Google Fonts:
https://fonts.google.com/specimen/Poppins

## Required Font Files

Place these files in this folder (`src/assets/fonts/`):

- Poppins-Thin.ttf
- Poppins-ExtraLight.ttf
- Poppins-Light.ttf
- Poppins-Regular.ttf
- Poppins-Medium.ttf
- Poppins-SemiBold.ttf
- Poppins-Bold.ttf
- Poppins-ExtraBold.ttf
- Poppins-Black.ttf

## Link Fonts

After adding the font files, run:

```bash
npx react-native-asset
```

This will copy the fonts to:
- iOS: `ios/absneet/Fonts/`
- Android: `android/app/src/main/assets/fonts/`

## Rebuild the App

After linking fonts, rebuild both platforms:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```
