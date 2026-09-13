import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'primary' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme: Default to 'primary' (Brand Deep Royal Navy from logo)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('easehub-theme');
      if (saved === 'primary' || saved === 'dark') return saved;
      return 'primary'; // Primary default: Logo Deep Royal Navy
    }
    return 'primary';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('dark', 'theme-primary', 'light');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('theme-primary');
    }
    localStorage.setItem('easehub-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'primary' ? 'dark' : 'primary'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
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
