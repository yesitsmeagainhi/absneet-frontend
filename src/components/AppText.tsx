// src/components/AppText.tsx
// Custom Text component that uses Poppins font by default
import React from 'react';
import { Text as RNText, TextProps, StyleSheet, Platform } from 'react-native';

// Font family mapping for different weights
export const Fonts = {
  thin: Platform.select({
    ios: 'Poppins-Thin',
    android: 'Poppins-Thin',
    default: 'Poppins-Thin',
  }),
  extraLight: Platform.select({
    ios: 'Poppins-ExtraLight',
    android: 'Poppins-ExtraLight',
    default: 'Poppins-ExtraLight',
  }),
  light: Platform.select({
    ios: 'Poppins-Light',
    android: 'Poppins-Light',
    default: 'Poppins-Light',
  }),
  regular: Platform.select({
    ios: 'Poppins-Regular',
    android: 'Poppins-Regular',
    default: 'Poppins-Regular',
  }),
  medium: Platform.select({
    ios: 'Poppins-Medium',
    android: 'Poppins-Medium',
    default: 'Poppins-Medium',
  }),
  semiBold: Platform.select({
    ios: 'Poppins-SemiBold',
    android: 'Poppins-SemiBold',
    default: 'Poppins-SemiBold',
  }),
  bold: Platform.select({
    ios: 'Poppins-Bold',
    android: 'Poppins-Bold',
    default: 'Poppins-Bold',
  }),
  extraBold: Platform.select({
    ios: 'Poppins-ExtraBold',
    android: 'Poppins-ExtraBold',
    default: 'Poppins-ExtraBold',
  }),
  black: Platform.select({
    ios: 'Poppins-Black',
    android: 'Poppins-Black',
    default: 'Poppins-Black',
  }),
};

// Map fontWeight to Poppins font family
const getFontFamily = (fontWeight?: TextProps['style']): string => {
  if (!fontWeight) return Fonts.regular!;

  // Extract fontWeight from style if it's an object or array
  let weight: string | number | undefined;

  if (Array.isArray(fontWeight)) {
    for (const style of fontWeight) {
      if (style && typeof style === 'object' && 'fontWeight' in style) {
        weight = (style as any).fontWeight;
        break;
      }
    }
  } else if (typeof fontWeight === 'object' && 'fontWeight' in fontWeight) {
    weight = (fontWeight as any).fontWeight;
  }

  if (!weight) return Fonts.regular!;

  // Map weight to font family
  switch (weight) {
    case '100':
    case 100:
      return Fonts.thin!;
    case '200':
    case 200:
      return Fonts.extraLight!;
    case '300':
    case 300:
      return Fonts.light!;
    case '400':
    case 400:
    case 'normal':
      return Fonts.regular!;
    case '500':
    case 500:
      return Fonts.medium!;
    case '600':
    case 600:
      return Fonts.semiBold!;
    case '700':
    case 700:
    case 'bold':
      return Fonts.bold!;
    case '800':
    case 800:
      return Fonts.extraBold!;
    case '900':
    case 900:
      return Fonts.black!;
    default:
      return Fonts.regular!;
  }
};

interface AppTextProps extends TextProps {
  weight?: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';
}

export const AppText: React.FC<AppTextProps> = ({ style, weight, children, ...props }) => {
  // Determine font family from weight prop or style
  let fontFamily = Fonts.regular;

  if (weight) {
    fontFamily = Fonts[weight];
  } else {
    fontFamily = getFontFamily(style);
  }

  return (
    <RNText
      {...props}
      style={[
        { fontFamily },
        style,
        // Remove fontWeight since we're using font family
        { fontWeight: undefined },
      ]}
    >
      {children}
    </RNText>
  );
};

// Also export as Text for easier replacement
export const Text = AppText;

export default AppText;
