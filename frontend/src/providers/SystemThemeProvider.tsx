'use client'

import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useEffect } from 'react';

export function SystemThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, loading, error } = useSystemSettings();

  useEffect(() => {
    if (settings) {
      console.log('🎨 System theme loaded from Directus:', {
        siteName: settings.site_name,
        primaryColor: settings.primary_color,
        accentColor: settings.accent_color,
        enableDarkMode: settings.enable_dark_mode,
        enableAnimations: settings.enable_animations
      });
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      console.warn('⚠️ Failed to load system theme, using grey defaults:', error);
    }
  }, [error]);

  return <>{children}</>;
}