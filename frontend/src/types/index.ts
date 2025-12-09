// Central type exports for the application
// This file provides a clean interface for all types used throughout the app

// Re-export site-specific types (manually maintained)
export * from './site';

// Re-export Directus types (auto-generated, don't edit manually)
export * from './directus';

// Re-export Directus SDK client and helpers
export * from '../lib/directus';

// Re-export transformation utilities
export * from '../lib/transformers';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Environment types
export interface EnvironmentConfig {
  directusUrl: string;
  directusToken?: string;
  nodeEnv: 'development' | 'production' | 'test';
  vercelEnv?: 'production' | 'preview' | 'development';
  isDevelopment: boolean;
  isProduction: boolean;
  isPreview: boolean;
}

// Application state types
export interface AppState {
  user: {
    isAuthenticated: boolean;
    profile?: any; // TODO: Define user profile type
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
  };
  ui: {
    sidebarOpen: boolean;
    loading: boolean;
    error?: string;
  };
}

// Generic utility types for components
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type Variant = 'solid' | 'outline' | 'ghost' | 'soft';

// Event handler types
export type EventHandler<T = void> = () => T;
export type ChangeHandler<T> = (value: T) => void;
export type AsyncEventHandler<T = void> = () => Promise<T>;

// Data fetching states
export interface FetchState<T> {
  data?: T;
  loading: boolean;
  error?: string;
  refetch: () => Promise<void>;
}

// Generic CRUD operations
export interface CrudOperations<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  create: (data: CreateData) => Promise<T>;
  read: (id: string | number) => Promise<T>;
  update: (id: string | number, data: UpdateData) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
  list: (params?: any) => Promise<T[]>;
}