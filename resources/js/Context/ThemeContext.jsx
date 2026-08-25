import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

function resolveInitialTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
        return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() =>
        typeof window !== 'undefined' ? resolveInitialTheme() : 'light',
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            return;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event) => {
            if (!localStorage.getItem('theme')) {
                setTheme(event.matches ? 'dark' : 'light');
            }
        };

        media.addEventListener('change', handleChange);

        return () => media.removeEventListener('change', handleChange);
    }, []);

    const setThemeAndPersist = (value) => {
        localStorage.setItem('theme', value);
        setTheme(value);
    };

    const toggleTheme = () => {
        setThemeAndPersist(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeAndPersist }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme debe usarse dentro de ThemeProvider');
    }

    return context;
}
