// src/theme/ThemeContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
} from 'react';

type ThemeContextValue = {
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // ✅ default = light theme
    const [isDark, setIsDark] = useState(false);

    const value = useMemo(
        () => ({
            isDark,
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
