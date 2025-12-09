'use client';

import { useEffect } from 'react';

interface PersonStructuredData {
  name: string;
  jobTitle?: string;
  description?: string;
  email?: string;
  telephone?: string;
  url?: string;
  image?: string;
  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  worksFor?: {
    name: string;
    url?: string;
  };
  alumniOf?: {
    name: string;
    url?: string;
  }[];
  knowsAbout?: string[];
}

interface WebsiteStructuredData {
  name: string;
  url: string;
  description?: string;
  author?: string;
}

interface StructuredDataProps {
  person?: PersonStructuredData;
  website?: WebsiteStructuredData;
}

export default function StructuredData({ person, website }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[data-structured-data]');
    existingScripts.forEach(script => script.remove());

    const structuredData: any[] = [];

    // Website structured data
    if (website) {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: website.name,
        url: website.url,
        description: website.description,
        author: website.author ? {
          '@type': 'Person',
          name: website.author
        } : undefined,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${website.url}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      });
    }

    // Person structured data
    if (person) {
      const personData: any = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        jobTitle: person.jobTitle,
        description: person.description,
        email: person.email,
        telephone: person.telephone,
        url: person.url,
        image: person.image,
      };

      if (person.address) {
        personData.address = {
          '@type': 'PostalAddress',
          addressLocality: person.address.addressLocality,
          addressRegion: person.address.addressRegion,
          addressCountry: person.address.addressCountry,
        };
      }

      if (person.sameAs && person.sameAs.length > 0) {
        personData.sameAs = person.sameAs;
      }

      if (person.worksFor) {
        personData.worksFor = {
          '@type': 'Organization',
          name: person.worksFor.name,
          url: person.worksFor.url,
        };
      }

      if (person.alumniOf && person.alumniOf.length > 0) {
        personData.alumniOf = person.alumniOf.map(school => ({
          '@type': 'EducationalOrganization',
          name: school.name,
          url: school.url,
        }));
      }

      if (person.knowsAbout && person.knowsAbout.length > 0) {
        personData.knowsAbout = person.knowsAbout;
      }

      structuredData.push(personData);
    }

    // Add structured data to document
    structuredData.forEach((data, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', 'true');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-structured-data]');
      scripts.forEach(script => script.remove());
    };
  }, [person, website]);

  return null; // This component doesn't render anything visible
}

// Utility functions for common structured data patterns
export const createPersonData = (identity: any, skills: any[] = []): PersonStructuredData => {
  const sameAs: string[] = [];
  
  if (identity?.linkedin) sameAs.push(identity.linkedin);
  if (identity?.github) sameAs.push(identity.github);
  if (identity?.portfolio) sameAs.push(identity.portfolio);
  if (identity?.website) sameAs.push(identity.website);

  return {
    name: identity?.first_name && identity?.last_name 
      ? `${identity.first_name} ${identity.last_name}`
      : 'Professional Portfolio',
    jobTitle: identity?.title || 'Professional',
    description: identity?.bio || 'Experienced professional with expertise in technology and business.',
    email: identity?.email,
    telephone: identity?.phone,
    url: identity?.website || identity?.portfolio,
    image: identity?.profile_image,
    address: {
      addressLocality: identity?.city,
      addressRegion: identity?.state,
      addressCountry: identity?.country || 'United States',
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: skills.map(skill => skill.name),
  };
};

export const createWebsiteData = (identity: any): WebsiteStructuredData => {
  const fullName = identity?.first_name && identity?.last_name 
    ? `${identity.first_name} ${identity.last_name}`
    : 'Master Resume';

  return {
    name: `${fullName} - Professional Portfolio`,
    url: process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    description: identity?.bio || 'Professional portfolio showcasing experience, projects, and skills.',
    author: fullName,
  };
};