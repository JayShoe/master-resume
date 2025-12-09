'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface Identity {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  tagline?: string;
  bio?: string;
  profile_photo?: string;
  linkedin_url?: string;
  linkedin?: string;
  github_url?: string;
  github?: string;
  twitter_url?: string;
  twitter?: string;
  instagram_url?: string;
  instagram?: string;
  website_url?: string;
  website?: string;
  portfolio_url?: string;
}

interface IdentityContextType {
  identity: Identity | null;
}

const IdentityContext = createContext<IdentityContextType>({ identity: null });

export function useIdentity() {
  return useContext(IdentityContext);
}

interface IdentityProviderProps {
  children: ReactNode;
  identity: Identity | null;
}

export function IdentityProvider({ children, identity }: IdentityProviderProps) {
  return (
    <IdentityContext.Provider value={{ identity }}>
      {children}
    </IdentityContext.Provider>
  );
}
