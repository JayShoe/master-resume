'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DesignToken {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'border' | 'shadow' | 'animation';
  category: string;
  description?: string;
}

export interface ThemeSettings {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  design_tokens: DesignToken[];
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  site_name: string;
  site_description: string;
  default_theme: string;
  available_themes: string[];
  theme_settings: ThemeSettings[];
  enable_dark_mode: boolean;
  enable_animations: boolean;
  performance_mode: boolean;
  custom_css?: string;
  updated_at: string;
}

export interface UseThemeReturn {
  // Theme state
  currentTheme: string;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  
  // Theme settings
  themeSettings: ThemeSettings | null;
  systemSettings: SystemSettings | null;
  designTokens: DesignToken[];
  
  // Theme actions
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  applyTheme: (themeName: string) => Promise<void>;
  refreshThemes: () => Promise<void>;
  
  // CSS generation
  generateCSSProperties: () => string;
  generateTailwindConfig: () => Record<string, any>;
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Performance and accessibility
  enableAnimations: boolean;
  performanceMode: boolean;
  
  // Theme utilities
  getDesignToken: (name: string) => DesignToken | null;
  getThemeColor: (colorName: string) => string;
  applyCustomCSS: (css: string) => void;
}

const STORAGE_KEY = 'portfolio-theme';
const SYSTEM_SETTINGS_CACHE_KEY = 'system-settings-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useTheme(): UseThemeReturn {
  // Core theme state
  const [currentTheme, setCurrentThemeState] = useState<string>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // Settings and tokens
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [designTokens, setDesignTokens] = useState<DesignToken[]>([]);
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    updateSystemTheme(mediaQuery);
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  // Update resolved theme based on current theme and system preference
  useEffect(() => {
    if (currentTheme === 'system') {
      setResolvedTheme(systemTheme);
    } else {
      setResolvedTheme(currentTheme as 'light' | 'dark');
    }
  }, [currentTheme, systemTheme]);

  // Cache management
  const getCachedSystemSettings = useCallback((): SystemSettings | null => {
    try {
      const cached = localStorage.getItem(SYSTEM_SETTINGS_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(SYSTEM_SETTINGS_CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }, []);

  const setCachedSystemSettings = useCallback((settings: SystemSettings) => {
    try {
      localStorage.setItem(
        SYSTEM_SETTINGS_CACHE_KEY,
        JSON.stringify({
          data: settings,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn('Failed to cache system settings:', error);
    }
  }, []);

  // Fetch system settings from API or static data
  const fetchSystemSettings = useCallback(async (): Promise<SystemSettings | null> => {
    try {
      // Check cache first
      const cached = getCachedSystemSettings();
      if (cached) return cached;

      // Check if we're in static mode - check both build-time and runtime
      const isStatic = process.env.NEXT_PUBLIC_USE_STATIC === 'true' ||
                       process.env.NODE_ENV === 'production';

      // Always try static first, then fall back to API
      try {
        const staticSettings = await import('../data/system-settings.json');
        const settingsData = Array.isArray(staticSettings.default)
          ? staticSettings.default[0]
          : staticSettings.default;
        const systemSettings = settingsData as unknown as SystemSettings;
        setCachedSystemSettings(systemSettings);
        return systemSettings;
      } catch (staticError) {
        // If static fails and we're not in static mode, try API
        if (!isStatic) {
          try {
            const response = await fetch('/api/portfolio/settings');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const settings = await response.json();
            const systemSettings = settings as unknown as SystemSettings;
            setCachedSystemSettings(systemSettings);
            return systemSettings;
          } catch (apiError) {
            console.error('Failed to fetch from API:', apiError);
            throw apiError;
          }
        } else {
          console.warn('Static system settings not available for theme');
          throw staticError;
        }
      }
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
      return null;
    }
  }, [getCachedSystemSettings, setCachedSystemSettings]);

  // Initialize theme from storage and fetch settings
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get stored theme preference
        const storedTheme = localStorage.getItem(STORAGE_KEY) || 'system';
        setCurrentThemeState(storedTheme);

        // Fetch system settings
        const settings = await fetchSystemSettings();
        if (settings) {
          setSystemSettings(settings);
          setEnableAnimations(settings.enable_animations);
          setPerformanceMode(settings.performance_mode);

          // Find and set current theme settings
          const themeSettings = settings.theme_settings || [];
          const currentThemeSettings = themeSettings.find(
            (theme) => theme.name === storedTheme ||
            (storedTheme === 'system' && theme.is_default)
          );

          if (currentThemeSettings) {
            setThemeSettings(currentThemeSettings);
            setDesignTokens(currentThemeSettings.design_tokens || []);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize theme');
      } finally {
        setLoading(false);
      }
    };

    initializeTheme();
  }, [fetchSystemSettings]);

  // Set theme with persistence
  const setTheme = useCallback(async (theme: string) => {
    try {
      setCurrentThemeState(theme);
      localStorage.setItem(STORAGE_KEY, theme);

      if (systemSettings) {
        const themeSettings = systemSettings.theme_settings || [];
        const newThemeSettings = themeSettings.find(
          (t) => t.name === theme || (theme === 'system' && t.is_default)
        );

        if (newThemeSettings) {
          setThemeSettings(newThemeSettings);
          setDesignTokens(newThemeSettings.design_tokens || []);
          await applyThemeToDOM(newThemeSettings);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to set theme');
    }
  }, [systemSettings]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // Apply theme to DOM
  const applyThemeToDOM = useCallback(async (theme: ThemeSettings) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(resolvedTheme);
    
    // Apply design tokens as CSS custom properties
    theme.design_tokens.forEach((token) => {
      const cssVar = `--${token.name.replace(/[A-Z]/g, '-$&').toLowerCase()}`;
      root.style.setProperty(cssVar, token.value);
    });
  }, [resolvedTheme]);

  // Apply specific theme by name
  const applyTheme = useCallback(async (themeName: string) => {
    if (!systemSettings) return;

    const themeSettings = systemSettings.theme_settings || [];
    const theme = themeSettings.find((t) => t.name === themeName);
    if (theme) {
      await applyThemeToDOM(theme);
      setThemeSettings(theme);
      setDesignTokens(theme.design_tokens || []);
    }
  }, [systemSettings, applyThemeToDOM]);

  // Refresh themes from server
  const refreshThemes = useCallback(async () => {
    try {
      setLoading(true);
      localStorage.removeItem(SYSTEM_SETTINGS_CACHE_KEY);
      
      const settings = await fetchSystemSettings();
      if (settings) {
        setSystemSettings(settings);
        
        // Update current theme if it exists
        const themeSettings = settings.theme_settings || [];
        const currentThemeSettings = themeSettings.find(
          (theme) => theme.name === currentTheme ||
          (currentTheme === 'system' && theme.is_default)
        );
        
        if (currentThemeSettings) {
          setThemeSettings(currentThemeSettings);
          setDesignTokens(currentThemeSettings.design_tokens || []);
          await applyThemeToDOM(currentThemeSettings);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to refresh themes');
    } finally {
      setLoading(false);
    }
  }, [currentTheme, fetchSystemSettings, applyThemeToDOM]);

  // Generate CSS custom properties string
  const generateCSSProperties = useCallback((): string => {
    return designTokens
      .map((token) => {
        const cssVar = `--${token.name.replace(/[A-Z]/g, '-$&').toLowerCase()}`;
        return `  ${cssVar}: ${token.value};`;
      })
      .join('\n');
  }, [designTokens]);

  // Generate Tailwind config object
  const generateTailwindConfig = useCallback((): Record<string, any> => {
    const config: Record<string, any> = {
      colors: {},
      spacing: {},
      fontSize: {},
      borderRadius: {},
      boxShadow: {},
      animation: {},
    };

    designTokens.forEach((token) => {
      const cssVar = `var(--${token.name.replace(/[A-Z]/g, '-$&').toLowerCase()})`;
      
      switch (token.type) {
        case 'color':
          config.colors[token.name] = cssVar;
          break;
        case 'spacing':
          config.spacing[token.name] = cssVar;
          break;
        case 'typography':
          config.fontSize[token.name] = cssVar;
          break;
        case 'border':
          config.borderRadius[token.name] = cssVar;
          break;
        case 'shadow':
          config.boxShadow[token.name] = cssVar;
          break;
        case 'animation':
          config.animation[token.name] = cssVar;
          break;
      }
    });

    return config;
  }, [designTokens]);

  // Utility functions
  const getDesignToken = useCallback((name: string): DesignToken | null => {
    return designTokens.find((token) => token.name === name) || null;
  }, [designTokens]);

  const getThemeColor = useCallback((colorName: string): string => {
    const token = designTokens.find((token) => 
      token.type === 'color' && token.name === colorName
    );
    return token?.value || '';
  }, [designTokens]);

  const applyCustomCSS = useCallback((css: string) => {
    if (typeof document === 'undefined') return;

    // Remove existing custom CSS
    const existingStyle = document.getElementById('portfolio-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new custom CSS
    const styleElement = document.createElement('style');
    styleElement.id = 'portfolio-custom-css';
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    if (themeSettings && !loading) {
      applyThemeToDOM(themeSettings);
    }
  }, [themeSettings, loading, applyThemeToDOM]);

  // Apply custom CSS from system settings
  useEffect(() => {
    if (systemSettings?.custom_css) {
      applyCustomCSS(systemSettings.custom_css);
    }
  }, [systemSettings?.custom_css, applyCustomCSS]);

  return {
    // Theme state
    currentTheme,
    resolvedTheme,
    systemTheme,
    
    // Theme settings
    themeSettings,
    systemSettings,
    designTokens,
    
    // Theme actions
    setTheme,
    toggleTheme,
    applyTheme,
    refreshThemes,
    
    // CSS generation
    generateCSSProperties,
    generateTailwindConfig,
    
    // Loading and error states
    loading,
    error,
    
    // Performance and accessibility
    enableAnimations,
    performanceMode,
    
    // Theme utilities
    getDesignToken,
    getThemeColor,
    applyCustomCSS,
  };
}