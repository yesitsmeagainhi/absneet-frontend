// src/theme/colors.ts
// Centralized color definitions for the app

export const Colors = {
  // Brand Colors
  primary: '#074e87',        // Deep Blue - main buttons, headers, navigation
  primaryDark: '#053d6b',    // Darker Blue - pressed states
  primaryLight: '#0a6bb8',   // Lighter Blue - hover/focus states

  accent: '#fc720a',         // Vibrant Orange - highlights, secondary actions
  accentDark: '#e56509',     // Darker Orange - pressed states
  accentLight: '#ff8c33',    // Lighter Orange - hover states

  // Status Colors (keep standard for accessibility)
  success: '#16A34A',
  successLight: '#22C55E',
  successBg: '#DCFCE7',
  successBgDark: '#052e16',

  error: '#DC2626',
  errorLight: '#EF4444',
  errorBg: '#FEE2E2',
  errorBgDark: '#450a0a',

  warning: '#F59E0B',
  warningBg: '#FEF3C7',

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const LightTheme = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textMuted: '#4B5563',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Cards
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',

  // Input
  inputBackground: '#F9FAFB',
  inputBorder: '#D1D5DB',
  inputBorderFocus: Colors.primary,
  placeholder: '#9CA3AF',

  // Status bar
  statusBar: 'dark-content' as const,
};

export const DarkTheme = {
  // Backgrounds
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  surface: '#1E293B',
  surfaceSecondary: '#334155',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#E5E7EB',
  textTertiary: '#9CA3AF',
  textMuted: '#6B7280',

  // Borders
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1E293B',

  // Cards
  cardBackground: '#1E293B',
  cardBorder: '#334155',

  // Input
  inputBackground: '#1E293B',
  inputBorder: '#475569',
  inputBorderFocus: Colors.primaryLight,
  placeholder: '#6B7280',

  // Status bar
  statusBar: 'light-content' as const,
};

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean) => {
  return {
    ...Colors,
    ...(isDark ? DarkTheme : LightTheme),
  };
};

export type ThemeColors = ReturnType<typeof getThemeColors>;
