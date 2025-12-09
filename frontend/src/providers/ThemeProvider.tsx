'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTheme as useThemeHook, UseThemeReturn, DesignToken, ThemeSettings } from '@/hooks/useTheme';

interface ThemeContextType extends UseThemeReturn {
  // Additional context-specific methods
  isThemeLoaded: boolean;
  hasThemeError: boolean;
  retryThemeLoad: () => Promise<void>;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  enableStorageSync?: boolean;
  enableSystemSync?: boolean;
  fallbackTheme?: Partial<ThemeSettings>;
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType | null>(null);

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Fallback theme for when Directus is unavailable
const createFallbackTheme = (partialTheme?: Partial<ThemeSettings>): ThemeSettings => ({
  id: 'fallback',
  name: 'system',
  description: 'Fallback theme when Directus is unavailable',
  is_default: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  design_tokens: [
    // Colors
    { id: '1', name: 'primary', value: '#3b82f6', type: 'color', category: 'brand' },
    { id: '2', name: 'primary-foreground', value: '#ffffff', type: 'color', category: 'brand' },
    { id: '3', name: 'secondary', value: '#64748b', type: 'color', category: 'brand' },
    { id: '4', name: 'secondary-foreground', value: '#ffffff', type: 'color', category: 'brand' },
    { id: '5', name: 'background', value: '#ffffff', type: 'color', category: 'surface' },
    { id: '6', name: 'foreground', value: '#0f172a', type: 'color', category: 'surface' },
    { id: '7', name: 'muted', value: '#f1f5f9', type: 'color', category: 'surface' },
    { id: '8', name: 'muted-foreground', value: '#64748b', type: 'color', category: 'surface' },
    { id: '9', name: 'card', value: '#ffffff', type: 'color', category: 'surface' },
    { id: '10', name: 'card-foreground', value: '#0f172a', type: 'color', category: 'surface' },
    { id: '11', name: 'border', value: '#e2e8f0', type: 'color', category: 'surface' },
    { id: '12', name: 'input', value: '#e2e8f0', type: 'color', category: 'surface' },
    { id: '13', name: 'ring', value: '#3b82f6', type: 'color', category: 'surface' },
    { id: '14', name: 'destructive', value: '#ef4444', type: 'color', category: 'semantic' },
    { id: '15', name: 'destructive-foreground', value: '#ffffff', type: 'color', category: 'semantic' },
    { id: '16', name: 'success', value: '#22c55e', type: 'color', category: 'semantic' },
    { id: '17', name: 'success-foreground', value: '#ffffff', type: 'color', category: 'semantic' },
    { id: '18', name: 'warning', value: '#f59e0b', type: 'color', category: 'semantic' },
    { id: '19', name: 'warning-foreground', value: '#ffffff', type: 'color', category: 'semantic' },
    
    // Spacing
    { id: '20', name: 'spacing-xs', value: '0.25rem', type: 'spacing', category: 'layout' },
    { id: '21', name: 'spacing-sm', value: '0.5rem', type: 'spacing', category: 'layout' },
    { id: '22', name: 'spacing-md', value: '1rem', type: 'spacing', category: 'layout' },
    { id: '23', name: 'spacing-lg', value: '1.5rem', type: 'spacing', category: 'layout' },
    { id: '24', name: 'spacing-xl', value: '2rem', type: 'spacing', category: 'layout' },
    
    // Typography
    { id: '25', name: 'font-size-xs', value: '0.75rem', type: 'typography', category: 'text' },
    { id: '26', name: 'font-size-sm', value: '0.875rem', type: 'typography', category: 'text' },
    { id: '27', name: 'font-size-base', value: '1rem', type: 'typography', category: 'text' },
    { id: '28', name: 'font-size-lg', value: '1.125rem', type: 'typography', category: 'text' },
    { id: '29', name: 'font-size-xl', value: '1.25rem', type: 'typography', category: 'text' },
    
    // Border Radius
    { id: '30', name: 'radius-sm', value: '0.25rem', type: 'border', category: 'layout' },
    { id: '31', name: 'radius-md', value: '0.375rem', type: 'border', category: 'layout' },
    { id: '32', name: 'radius-lg', value: '0.5rem', type: 'border', category: 'layout' },
    
    // Shadows
    { id: '33', name: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', type: 'shadow', category: 'effects' },
    { id: '34', name: 'shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', type: 'shadow', category: 'effects' },
    { id: '35', name: 'shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', type: 'shadow', category: 'effects' },
    
    // Animations
    { id: '36', name: 'transition-fast', value: '150ms ease-in-out', type: 'animation', category: 'motion' },
    { id: '37', name: 'transition-normal', value: '250ms ease-in-out', type: 'animation', category: 'motion' },
    { id: '38', name: 'transition-slow', value: '350ms ease-in-out', type: 'animation', category: 'motion' },
  ],
  ...partialTheme,
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableStorageSync = true,
  enableSystemSync = true,
  fallbackTheme,
}: ThemeProviderProps) {
  // Use the theme hook
  const themeHook = useThemeHook();
  
  // Enhanced state for context
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [lastError, setLastError] = React.useState<string | null>(null);

  // Initialize fallback theme if needed
  useEffect(() => {
    if (themeHook.error && !themeHook.themeSettings && !isInitialized) {
      console.warn('Theme Provider: Using fallback theme due to Directus connection issues');
      const fallback = createFallbackTheme(fallbackTheme);
      
      // Apply fallback theme to DOM
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.classList.add(themeHook.resolvedTheme);
        
        fallback.design_tokens.forEach((token) => {
          const cssVar = `--${token.name}`;
          root.style.setProperty(cssVar, token.value);
        });
      }
      
      setIsInitialized(true);
    } else if (themeHook.themeSettings && !themeHook.loading) {
      setIsInitialized(true);
    }
  }, [themeHook.error, themeHook.themeSettings, themeHook.loading, themeHook.resolvedTheme, fallbackTheme, isInitialized]);

  // Storage synchronization
  useEffect(() => {
    if (!enableStorageSync || typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio-theme' && e.newValue !== themeHook.currentTheme) {
        themeHook.setTheme(e.newValue || defaultTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [enableStorageSync, themeHook.currentTheme, themeHook.setTheme, defaultTheme]);

  // System theme synchronization
  useEffect(() => {
    if (!enableSystemSync) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeHook.currentTheme === 'system') {
        // Force re-evaluation of system theme
        themeHook.setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystemSync, themeHook.currentTheme, themeHook.setTheme]);

  // Error tracking
  useEffect(() => {
    if (themeHook.error && themeHook.error !== lastError) {
      setLastError(themeHook.error);
      console.error('Theme Provider Error:', themeHook.error);
    }
  }, [themeHook.error, lastError]);

  // Retry theme loading
  const retryThemeLoad = React.useCallback(async () => {
    if (retryCount >= 3) {
      console.error('Theme Provider: Max retry attempts reached');
      return;
    }

    try {
      setRetryCount(prev => prev + 1);
      await themeHook.refreshThemes();
      setLastError(null);
    } catch (error) {
      console.error('Theme Provider: Retry failed', error);
    }
  }, [retryCount, themeHook.refreshThemes]);

  // Enhanced context value
  const contextValue: ThemeContextType = {
    ...themeHook,
    isThemeLoaded: isInitialized && !themeHook.loading,
    hasThemeError: !!themeHook.error,
    retryThemeLoad,
  };

  // Provide theme information to CSS
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeHook.currentTheme);
      document.documentElement.setAttribute('data-resolved-theme', themeHook.resolvedTheme);
      document.documentElement.setAttribute('data-theme-loaded', isInitialized.toString());
      
      if (themeHook.performanceMode) {
        document.documentElement.setAttribute('data-performance-mode', 'true');
      } else {
        document.documentElement.removeAttribute('data-performance-mode');
      }

      if (!themeHook.enableAnimations) {
        document.documentElement.setAttribute('data-animations-disabled', 'true');
      } else {
        document.documentElement.removeAttribute('data-animations-disabled');
      }
    }
  }, [
    themeHook.currentTheme,
    themeHook.resolvedTheme,
    themeHook.performanceMode,
    themeHook.enableAnimations,
    isInitialized
  ]);

  // Preload theme resources
  useEffect(() => {
    if (isInitialized && themeHook.systemSettings) {
      // Preload theme assets
      themeHook.systemSettings.theme_settings.forEach((theme) => {
        if (theme.design_tokens) {
          theme.design_tokens
            .filter(token => token.type === 'color' && token.value.startsWith('url('))
            .forEach((token) => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = token.value.slice(4, -1);
              document.head.appendChild(link);
            });
        }
      });
    }
  }, [isInitialized, themeHook.systemSettings]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Higher-order component for theme-aware components
export function withTheme<P extends object>(Component: React.ComponentType<P>) {
  return function ThemedComponent(props: P) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
}

// Theme status indicator component for debugging
export function ThemeStatus() {
  const theme = useTheme();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 p-2 bg-black/80 text-white text-xs rounded z-50">
      <div>Theme: {theme.currentTheme}</div>
      <div>Resolved: {theme.resolvedTheme}</div>
      <div>Loaded: {theme.isThemeLoaded ? '✓' : '✗'}</div>
      <div>Tokens: {theme.designTokens.length}</div>
      {theme.hasThemeError && (
        <div className="text-red-400">Error: {theme.error}</div>
      )}
    </div>
  );
}