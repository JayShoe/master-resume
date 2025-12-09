'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve theme based on current theme setting
  const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to document
  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  // Set theme with persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    let savedTheme = defaultTheme;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        savedTheme = stored as Theme;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }

    setThemeState(savedTheme);
    const resolved = resolveTheme(savedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, [defaultTheme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme, enableSystem]);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a fallback instead of throwing during SSR or before hydration
    return {
      theme: 'system' as Theme,
      setTheme: () => {},
      resolvedTheme: 'light' as 'light' | 'dark',
      toggleTheme: () => {},
    };
  }
  return context;
};

// Theme toggle component
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border border-gray-200 ${className}`} />
    );
  }

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => {
          const currentIndex = themeOptions.findIndex(opt => opt.value === theme);
          const nextIndex = (currentIndex + 1) % themeOptions.length;
          setTheme(themeOptions[nextIndex]?.value || 'light');
        }}
        className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title={`Current theme: ${theme} (${resolvedTheme}). Click to cycle through themes.`}
      >
        <span className="text-sm">
          {theme === 'system' 
            ? (resolvedTheme === 'dark' ? '🌙' : '☀️')
            : themeOptions.find(opt => opt.value === theme)?.icon
          }
        </span>
      </button>
    </div>
  );
}

// Dropdown version of theme toggle
export function ThemeSelect({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-32 h-9 bg-gray-200 rounded ${className}`} />;
  }

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      className={`px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${className}`}
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="system">💻 System</option>
    </select>
  );
}