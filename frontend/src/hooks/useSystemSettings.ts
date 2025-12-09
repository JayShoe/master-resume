'use client'

import { useState, useEffect } from 'react';

export interface SystemSettings {
  id: number;
  site_name: string;
  tagline: string;
  font_primary: string;
  font_secondary: string;
  font_mono: string;
  primary_color: string;
  primary_light: string;
  primary_dark: string;
  background_primary: string;
  background_secondary: string;
  text_primary: string;
  text_secondary: string;
  enable_animations: boolean;
  enable_dark_mode: boolean;
  accent_color: string;
  success_color: string;
  warning_color: string;
  status: string;
  date_created: string;
  date_updated: string;
}

// Convert hex color to HSL space-separated values for CSS custom properties
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  // Convert to 0-360 for hue, 0-100 for saturation and lightness
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

// Default fallback settings
const DEFAULT_SETTINGS: SystemSettings = {
  id: 0,
  site_name: 'Portfolio',
  tagline: 'Professional Portfolio',
  font_primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  font_secondary: 'system-ui, sans-serif',
  font_mono: 'JetBrains Mono, monospace',
  primary_color: '#1E293B',
  primary_light: '#475569',
  primary_dark: '#0F172A',
  background_primary: '#FFFFFF',
  background_secondary: '#F8FAFC',
  text_primary: '#0F172A',
  text_secondary: '#475569',
  enable_animations: true,
  enable_dark_mode: true,
  accent_color: '#2563EB',
  success_color: '#059669',
  warning_color: '#DC6803',
  status: 'published',
  date_created: new Date().toISOString(),
  date_updated: new Date().toISOString(),
};

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ensure we're running in browser context
        if (typeof window === 'undefined') {
          console.log('Skipping settings fetch - not in browser context');
          return;
        }

        // Check if we're in static mode
        const isStatic = process.env.NEXT_PUBLIC_USE_STATIC === 'true' ||
                         process.env.NODE_ENV === 'production';

        // Always try static first, then fall back to API
        try {
          const staticSettings = await import('../data/system-settings.json');
          const systemSettings = Array.isArray(staticSettings.default)
            ? staticSettings.default[0]
            : staticSettings.default;

          if (!mounted) return;

          if (systemSettings) {
            setSettings(systemSettings as unknown as SystemSettings);
            applySystemColors(systemSettings as unknown as SystemSettings);
          }
        } catch (staticError) {
          // If static fails and we're not in static mode, try API
          if (!isStatic) {
            try {
              const url = typeof window !== 'undefined'
                ? '/api/portfolio/settings'
                : `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:3000'}/api/portfolio/settings`;

              console.log('Fetching settings from:', url);

              const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
              }

              const systemSettings = await response.json();

              if (!mounted) return;

              if (systemSettings) {
                setSettings(systemSettings as SystemSettings);
                applySystemColors(systemSettings as SystemSettings);
              }
            } catch (fetchError) {
              console.error('Fetch error details:', fetchError);
              throw fetchError;
            }
          } else {
            console.warn('Static system settings not available, using defaults');
            throw staticError;
          }
        }
      } catch (err) {
        if (!mounted) return;

        console.error('Failed to fetch system settings, using defaults:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch system settings');

        // Use default settings as fallback
        setSettings(DEFAULT_SETTINGS);
        applySystemColors(DEFAULT_SETTINGS);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const applySystemColors = (settings: SystemSettings) => {
    const root = document.documentElement;
    
    try {
      // Apply primary colors from Directus
      if (settings.primary_color) {
        root.style.setProperty('--primary', hexToHsl(settings.primary_color));
      }
      
      if (settings.accent_color) {
        root.style.setProperty('--secondary', hexToHsl(settings.accent_color));
      }
      
      if (settings.success_color) {
        root.style.setProperty('--success', hexToHsl(settings.success_color));
      }
      
      if (settings.warning_color) {
        root.style.setProperty('--warning', hexToHsl(settings.warning_color));
      }
      
      // Apply background colors
      if (settings.background_primary) {
        root.style.setProperty('--background', hexToHsl(settings.background_primary));
        root.style.setProperty('--card', hexToHsl(settings.background_primary));
      }
      
      if (settings.background_secondary) {
        root.style.setProperty('--muted', hexToHsl(settings.background_secondary));
        root.style.setProperty('--accent', hexToHsl(settings.background_secondary));
      }
      
      // Apply text colors
      if (settings.text_primary) {
        root.style.setProperty('--foreground', hexToHsl(settings.text_primary));
        root.style.setProperty('--card-foreground', hexToHsl(settings.text_primary));
      }
      
      if (settings.text_secondary) {
        root.style.setProperty('--muted-foreground', hexToHsl(settings.text_secondary));
      }
      
      // Apply additional theme colors for enhanced experience
      if (settings.primary_light) {
        root.style.setProperty('--primary-light', hexToHsl(settings.primary_light));
      }
      
      if (settings.primary_dark) {
        root.style.setProperty('--primary-dark', hexToHsl(settings.primary_dark));
      }

      console.log('✅ Applied system colors from Directus:', {
        primary: settings.primary_color,
        accent: settings.accent_color,
        success: settings.success_color,
        warning: settings.warning_color
      });
      
    } catch (err) {
      console.error('Failed to apply system colors:', err);
    }
  };

  return {
    settings,
    loading,
    error,
    applySystemColors
  };
}