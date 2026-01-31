// src/theme/ThemeContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
} from 'react';
import { Colors, LightTheme, DarkTheme, getThemeColors, ThemeColors } from './colors';

// Poppins font family mapping
export const Fonts = {
    thin: 'Poppins-Thin',
    extraLight: 'Poppins-ExtraLight',
    light: 'Poppins-Light',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    extraBold: 'Poppins-ExtraBold',
    black: 'Poppins-Black',
};

type ThemeContextValue = {
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Default = light theme
    const [isDark, setIsDark] = useState(false);

    const value = useMemo(
        () => ({
            isDark,
            colors: getThemeColors(isDark),
            toggleTheme: () => setIsDark(prev => !prev),
        }),
        [isDark],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }

    return ctx;
};

// Re-export colors for direct access when needed
export { Colors, LightTheme, DarkTheme, getThemeColors };
export type { ThemeColors };
