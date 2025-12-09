'use client'

import { useSystemSettings } from '@/hooks/useSystemSettings';

export default function ThemeTestPage() {
  const { settings, loading, error } = useSystemSettings();

  if (loading) return <div className="p-8">Loading system settings...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Dynamic Theme System Test</h1>
        
        {/* System Settings Display */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Current System Settings</h2>
          {settings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Site Name:</strong> {settings.site_name}</div>
              <div><strong>Tagline:</strong> {settings.tagline}</div>
              <div><strong>Primary Color:</strong> <span className="inline-block w-4 h-4 rounded ml-2" style={{backgroundColor: settings.primary_color}}></span> {settings.primary_color}</div>
              <div><strong>Accent Color:</strong> <span className="inline-block w-4 h-4 rounded ml-2" style={{backgroundColor: settings.accent_color}}></span> {settings.accent_color}</div>
              <div><strong>Success Color:</strong> <span className="inline-block w-4 h-4 rounded ml-2" style={{backgroundColor: settings.success_color}}></span> {settings.success_color}</div>
              <div><strong>Warning Color:</strong> <span className="inline-block w-4 h-4 rounded ml-2" style={{backgroundColor: settings.warning_color}}></span> {settings.warning_color}</div>
              <div><strong>Enable Dark Mode:</strong> {settings.enable_dark_mode ? 'Yes' : 'No'}</div>
              <div><strong>Enable Animations:</strong> {settings.enable_animations ? 'Yes' : 'No'}</div>
            </div>
          ) : (
            <p className="text-muted-foreground">No system settings found. Using default grey theme.</p>
          )}
        </div>

        {/* Color Palette Demo */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Dynamic Color Palette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Primary</h3>
              <div className="bg-primary text-primary-foreground p-4 rounded">Primary Background</div>
              <div className="text-primary p-2">Primary Text</div>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Secondary</h3>
              <div className="bg-secondary text-secondary-foreground p-4 rounded">Secondary Background</div>
              <div className="text-secondary p-2">Secondary Text</div>
            </div>

            {/* Success Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Success</h3>
              <div className="bg-success text-success-foreground p-4 rounded">Success Background</div>
              <div className="text-success p-2">Success Text</div>
            </div>

            {/* Warning Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Warning</h3>
              <div className="bg-warning text-warning-foreground p-4 rounded">Warning Background</div>
              <div className="text-warning p-2">Warning Text</div>
            </div>

            {/* Muted Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Muted</h3>
              <div className="bg-muted text-muted-foreground p-4 rounded">Muted Background</div>
              <div className="text-muted-foreground p-2">Muted Text</div>
            </div>

            {/* Accent Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Accent</h3>
              <div className="bg-accent text-accent-foreground p-4 rounded">Accent Background</div>
              <div className="text-accent-foreground p-2">Accent Text</div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Component Examples</h2>
          <div className="space-y-4">
            {/* Buttons */}
            <div className="space-x-4">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-colors">
                Primary Button
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:opacity-90 transition-colors">
                Secondary Button
              </button>
              <button className="bg-success text-success-foreground px-4 py-2 rounded hover:opacity-90 transition-colors">
                Success Button
              </button>
              <button className="bg-warning text-warning-foreground px-4 py-2 rounded hover:opacity-90 transition-colors">
                Warning Button
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-muted p-4 rounded border border-border">
                <h3 className="text-foreground font-semibold mb-2">Sample Card</h3>
                <p className="text-muted-foreground">This card uses muted background with semantic text colors that adapt to the theme.</p>
              </div>
              <div className="bg-accent p-4 rounded border border-border">
                <h3 className="text-accent-foreground font-semibold mb-2">Accent Card</h3>
                <p className="text-accent-foreground/80">This card uses accent background with semantic text colors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">How It Works</h2>
          <div className="prose prose-sm text-muted-foreground">
            <p>The theme system works in three layers:</p>
            <ol className="list-decimal list-inside space-y-2 mt-4">
              <li><strong>Grey Base Theme:</strong> Clean, professional grey defaults defined in CSS</li>
              <li><strong>Directus Integration:</strong> System fetches colors from the system_settings collection</li>
              <li><strong>Dynamic Application:</strong> Colors are applied to CSS custom properties in real-time</li>
            </ol>
            <p className="mt-4">
              To customize the theme, simply update the color values in your Directus system_settings collection.
              The changes will be reflected immediately on the frontend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}