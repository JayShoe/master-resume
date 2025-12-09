'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface NavigationProps {
  breadcrumbs?: BreadcrumbItem[];
}

export default function Navigation({ breadcrumbs }: NavigationProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbItems: BreadcrumbItem[] = [
      { name: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbItems.push({
        name: name.replace('-', ' '),
        href: currentPath
      });
    });

    return breadcrumbItems;
  };

  const items = breadcrumbs || generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="w-full border-b bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              
              return (
                <li key={item.href} className="flex items-center">
                  {index === 0 && (
                    <Home className="h-4 w-4 mr-1 text-muted-foreground" />
                  )}
                  
                  {isLast ? (
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                  
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}

// Utility component for page navigation
interface PageNavigationProps {
  previousPage?: {
    name: string;
    href: string;
  };
  nextPage?: {
    name: string;
    href: string;
  };
}

export function PageNavigation({ previousPage, nextPage }: PageNavigationProps) {
  if (!previousPage && !nextPage) {
    return null;
  }

  return (
    <nav className="w-full py-8">
      <div className="flex justify-between">
        <div className="flex-1">
          {previousPage && (
            <Link
              href={previousPage.href}
              className="group flex items-center p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="text-sm text-muted-foreground mb-1">Previous</p>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {previousPage.name}
                </p>
              </div>
            </Link>
          )}
        </div>
        
        <div className="flex-1 flex justify-end">
          {nextPage && (
            <Link
              href={nextPage.href}
              className="group flex items-center p-4 rounded-lg border hover:bg-accent transition-colors text-right"
            >
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next</p>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {nextPage.name}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}