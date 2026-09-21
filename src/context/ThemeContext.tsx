import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'primary' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>('primary');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'primary');
    root.classList.remove('dark');
    root.classList.add('theme-primary');
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('easehub-theme');
        localStorage.setItem('easehub-theme', 'primary');
      } catch {
        // Ignore storage errors in sandbox
      }
    }
  }, []);

  const toggleTheme = () => {
    // Dark mode removed per user request: site is strictly in light mode
  };

  const setTheme = (_newTheme: Theme) => {
    // Always strictly maintain primary light mode
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
