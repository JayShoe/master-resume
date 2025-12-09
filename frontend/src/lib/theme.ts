import { DesignToken, ThemeSettings } from '@/hooks/useTheme';

// Color utility functions
export const colorUtils = {
  // Convert hex to HSL
  hexToHsl(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number;

    l = (max + min) / 2;

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

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  },

  // Convert HSL to HSL string for CSS
  hslToString(h: number, s: number, l: number): string {
    return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
  },

  // Parse color value and convert to HSL
  parseColorToHsl(color: string): string {
    // Handle hex colors
    if (color.startsWith('#')) {
      return this.hexToHsl(color);
    }
    
    // Handle RGB colors
    if (color.startsWith('rgb')) {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches) {
        const [, r, g, b] = matches;
        const hex = `#${parseInt(r || '0').toString(16).padStart(2, '0')}${parseInt(g || '0').toString(16).padStart(2, '0')}${parseInt(b || '0').toString(16).padStart(2, '0')}`;
        return this.hexToHsl(hex);
      }
    }

    // Handle HSL colors (return as is but normalize format)
    if (color.startsWith('hsl')) {
      const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (matches) {
        const [, h, s, l] = matches;
        return this.hslToString(parseInt(h || '0'), parseInt(s || '0'), parseInt(l || '0'));
      }
    }

    // Handle space-separated HSL values (our format)
    if (/^\d+\s+\d+%\s+\d+%$/.test(color)) {
      return color;
    }

    // Fallback: assume it's already in the correct format
    return color;
  },

  // Generate color variations
  generateColorVariations(baseColor: string, count: number = 9): Record<string, string> {
    const hsl = this.parseColorToHsl(baseColor);
    const parts = hsl.split(' ');
    const h = parseInt(parts[0] || '0');
    const s = parseInt((parts[1] || '0%').replace('%', ''));
    const l = parseInt((parts[2] || '0%').replace('%', ''));

    const variations: Record<string, string> = {};
    
    // Generate shades from light to dark
    for (let i = 0; i < count; i++) {
      const shade = (i + 1) * 100;
      const lightness = Math.max(5, Math.min(95, l + (45 - i * 10)));
      variations[shade.toString()] = this.hslToString(h, s, lightness);
    }

    return variations;
  },

  // Check if color is dark
  isColorDark(color: string): boolean {
    const hsl = this.parseColorToHsl(color);
    const parts = hsl.split(' ');
    const lightness = parseInt((parts[2] || '50%').replace('%', ''));
    return lightness < 50;
  },

  // Get contrasting color
  getContrastingColor(color: string): string {
    return this.isColorDark(color) ? '255 255 255' : '0 0 0';
  }
};

// Design token utilities
export const tokenUtils = {
  // Convert design tokens to CSS custom properties
  tokensToCssProperties(tokens: DesignToken[]): Record<string, string> {
    const properties: Record<string, string> = {};

    tokens.forEach((token) => {
      const cssVarName = `--${token.name.replace(/[A-Z]/g, '-$&').toLowerCase()}`;
      
      // Process color tokens to HSL format
      if (token.type === 'color') {
        properties[cssVarName] = colorUtils.parseColorToHsl(token.value);
      } else {
        properties[cssVarName] = token.value;
      }
    });

    return properties;
  },

  // Generate CSS string from properties
  propertiesToCssString(properties: Record<string, string>): string {
    return Object.entries(properties)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');
  },

  // Group tokens by category
  groupTokensByCategory(tokens: DesignToken[]): Record<string, DesignToken[]> {
    return tokens.reduce((groups, token) => {
      if (!groups[token.category]) {
        groups[token.category] = [];
      }
      groups[token.category]!.push(token);
      return groups;
    }, {} as Record<string, DesignToken[]>);
  },

  // Group tokens by type
  groupTokensByType(tokens: DesignToken[]): Record<string, DesignToken[]> {
    return tokens.reduce((groups, token) => {
      if (!groups[token.type]) {
        groups[token.type] = [];
      }
      groups[token.type]!.push(token);
      return groups;
    }, {} as Record<string, DesignToken[]>);
  },

  // Validate design token
  validateToken(token: DesignToken): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!token.name || token.name.trim() === '') {
      errors.push('Token name is required');
    }

    if (!token.value || token.value.trim() === '') {
      errors.push('Token value is required');
    }

    if (!token.type) {
      errors.push('Token type is required');
    }

    // Type-specific validation
    switch (token.type) {
      case 'color':
        if (!/^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\(|hsl\(|\d+\s+\d+%\s+\d+%)/.test(token.value)) {
          errors.push('Invalid color format');
        }
        break;
      case 'spacing':
        if (!/^(\d+(\.\d+)?(px|rem|em|%|vh|vw))$/.test(token.value)) {
          errors.push('Invalid spacing format (expected: number + unit)');
        }
        break;
      case 'typography':
        if (!/^(\d+(\.\d+)?(px|rem|em)|[\w\s,]+)$/.test(token.value)) {
          errors.push('Invalid typography format');
        }
        break;
      case 'border':
        if (!/^(\d+(\.\d+)?(px|rem|em|%))$/.test(token.value)) {
          errors.push('Invalid border radius format');
        }
        break;
      case 'shadow':
        // Allow complex shadow values
        break;
      case 'animation':
        // Allow complex animation values
        break;
    }

    return { valid: errors.length === 0, errors };
  }
};

// Theme utilities
export const themeUtils = {
  // Apply theme to DOM
  applyThemeToDOM(theme: ThemeSettings, resolvedTheme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(resolvedTheme);

    // Apply design tokens as CSS custom properties
    const properties = tokenUtils.tokensToCssProperties(theme.design_tokens);
    Object.entries(properties).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });

    // Set theme metadata
    root.setAttribute('data-theme', theme.name);
    root.setAttribute('data-resolved-theme', resolvedTheme);
  },

  // Generate CSS file content
  generateThemeCssFile(theme: ThemeSettings): string {
    const properties = tokenUtils.tokensToCssProperties(theme.design_tokens);
    const cssString = tokenUtils.propertiesToCssString(properties);

    return `/* Auto-generated theme: ${theme.name} */
:root {
${cssString}
}

/* Theme-specific overrides */
.${theme.name} {
${cssString}
}
`;
  },

  // Generate Tailwind config
  generateTailwindConfig(theme: ThemeSettings): Record<string, any> {
    const tokens = theme.design_tokens;
    const config: Record<string, any> = {
      colors: {},
      spacing: {},
      fontSize: {},
      borderRadius: {},
      boxShadow: {},
      animation: {},
    };

    tokens.forEach((token) => {
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
  },

  // Create theme from base colors
  createThemeFromColors(colors: Record<string, string>, name: string = 'custom'): ThemeSettings {
    const designTokens: DesignToken[] = [];
    let tokenId = 1;

    // Generate core design tokens from colors
    Object.entries(colors).forEach(([colorName, colorValue]) => {
      // Main color
      designTokens.push({
        id: (tokenId++).toString(),
        name: colorName,
        value: colorValue,
        type: 'color',
        category: 'brand',
      });

      // Generate variations if this is a primary color
      if (colorName === 'primary') {
        const variations = colorUtils.generateColorVariations(colorValue);
        Object.entries(variations).forEach(([shade, value]) => {
          designTokens.push({
            id: (tokenId++).toString(),
            name: `${colorName}-${shade}`,
            value: `hsl(${value})`,
            type: 'color',
            category: 'brand',
          });
        });
      }

      // Generate contrasting foreground color
      const foregroundColor = colorUtils.getContrastingColor(colorValue);
      designTokens.push({
        id: (tokenId++).toString(),
        name: `${colorName}-foreground`,
        value: foregroundColor,
        type: 'color',
        category: 'brand',
      });
    });

    return {
      id: 'custom',
      name,
      description: `Auto-generated theme: ${name}`,
      is_default: false,
      design_tokens: designTokens,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  // Merge themes
  mergeThemes(baseTheme: ThemeSettings, overlayTheme: Partial<ThemeSettings>): ThemeSettings {
    const mergedTokens = [...baseTheme.design_tokens];
    
    if (overlayTheme.design_tokens) {
      overlayTheme.design_tokens.forEach((overlayToken) => {
        const existingIndex = mergedTokens.findIndex(t => t.name === overlayToken.name);
        if (existingIndex >= 0) {
          mergedTokens[existingIndex] = overlayToken;
        } else {
          mergedTokens.push(overlayToken);
        }
      });
    }

    return {
      ...baseTheme,
      ...overlayTheme,
      design_tokens: mergedTokens,
      updated_at: new Date().toISOString(),
    };
  },

  // Extract theme from CSS
  extractThemeFromCss(css: string): DesignToken[] {
    const tokens: DesignToken[] = [];
    const customPropertyRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
    let match;
    let id = 1;

    while ((match = customPropertyRegex.exec(css)) !== null) {
      const [, name, value] = match;
      
      if (!name || !value) continue;
      
      // Determine token type based on name patterns
      let type: DesignToken['type'] = 'color';
      let category = 'general';

      if (name.includes('color') || name.includes('background') || name.includes('foreground')) {
        type = 'color';
        category = 'surface';
      } else if (name.includes('spacing') || name.includes('margin') || name.includes('padding')) {
        type = 'spacing';
        category = 'layout';
      } else if (name.includes('font') || name.includes('text') || name.includes('line-height')) {
        type = 'typography';
        category = 'text';
      } else if (name.includes('radius') || name.includes('border')) {
        type = 'border';
        category = 'layout';
      } else if (name.includes('shadow')) {
        type = 'shadow';
        category = 'effects';
      } else if (name.includes('transition') || name.includes('animation')) {
        type = 'animation';
        category = 'motion';
      }

      tokens.push({
        id: (id++).toString(),
        name: name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
        value: value.trim(),
        type,
        category,
      });
    }

    return tokens;
  }
};

// Performance utilities
export const performanceUtils = {
  // Debounce function for theme updates
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for rapid theme changes
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if theme should use performance mode
  shouldUsePerformanceMode(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    // Check for low-end devices
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType && 
        ['slow-2g', '2g'].includes(connection.effectiveType)) {
      return true;
    }

    // Check for battery status
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        return battery.level < 0.2; // Low battery
      });
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }

    return false;
  },

  // Optimize theme for performance
  optimizeThemeForPerformance(theme: ThemeSettings): ThemeSettings {
    const optimizedTokens = theme.design_tokens.filter((token) => {
      // Remove complex animations and shadows in performance mode
      if (token.type === 'animation' || token.type === 'shadow') {
        return false;
      }
      return true;
    });

    return {
      ...theme,
      design_tokens: optimizedTokens,
    };
  }
};

// Export all utilities
export default {
  colorUtils,
  tokenUtils,
  themeUtils,
  performanceUtils,
};