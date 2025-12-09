'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
  enableInDevelopment?: boolean;
}

interface AnalyticsProps extends AnalyticsConfig {
  children?: React.ReactNode;
}

export default function Analytics({
  googleAnalyticsId,
  facebookPixelId,
  hotjarId,
  enableInDevelopment = false,
  children
}: AnalyticsProps) {
  const pathname = usePathname();

  const shouldLoadAnalytics = enableInDevelopment || process.env.NODE_ENV === 'production';

  // Google Analytics
  useEffect(() => {
    if (!shouldLoadAnalytics || !googleAnalyticsId) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [googleAnalyticsId, shouldLoadAnalytics]);

  // Facebook Pixel
  useEffect(() => {
    if (!shouldLoadAnalytics || !facebookPixelId) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${facebookPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [facebookPixelId, shouldLoadAnalytics]);

  // Hotjar
  useEffect(() => {
    if (!shouldLoadAnalytics || !hotjarId) return;

    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [hotjarId, shouldLoadAnalytics]);

  // Track page views
  useEffect(() => {
    if (!shouldLoadAnalytics) return;

    const trackPageView = () => {
      // Google Analytics
      if (window.gtag) {
        window.gtag('config', googleAnalyticsId!, {
          page_path: pathname,
          page_title: document.title,
        });
      }

      // Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('track', 'PageView');
      }

      // Custom analytics (could be your own API)
      trackCustomPageView(pathname);
    };

    trackPageView();
  }, [pathname, googleAnalyticsId, shouldLoadAnalytics]);

  return <>{children}</>;
}

// Custom analytics functions
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics Event:', eventName, parameters);
    return;
  }

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }

  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }

  // Custom analytics
  trackCustomEvent(eventName, parameters);
};

export const trackContactFormSubmission = (inquiryType: string) => {
  trackEvent('contact_form_submission', {
    event_category: 'engagement',
    event_label: inquiryType,
    value: 1,
  });
};

export const trackProjectView = (projectName: string) => {
  trackEvent('project_view', {
    event_category: 'content',
    event_label: projectName,
  });
};

export const trackSkillInteraction = (skillName: string, action: string) => {
  trackEvent('skill_interaction', {
    event_category: 'engagement',
    event_label: skillName,
    custom_parameter_1: action,
  });
};

export const trackResumeDownload = () => {
  trackEvent('resume_download', {
    event_category: 'engagement',
    event_label: 'pdf_download',
    value: 1,
  });
};

export const trackSocialLinkClick = (platform: string) => {
  trackEvent('social_link_click', {
    event_category: 'social',
    event_label: platform,
  });
};

export const trackSearchQuery = (query: string, resultsCount: number) => {
  trackEvent('search', {
    event_category: 'engagement',
    event_label: query,
    value: resultsCount,
  });
};

// Performance tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals tracking - temporarily disabled
  // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
  //   getCLS((metric: any) => trackEvent('web_vitals', { metric_name: 'CLS', value: metric.value }));
  //   getFID((metric: any) => trackEvent('web_vitals', { metric_name: 'FID', value: metric.value }));
  //   getFCP((metric: any) => trackEvent('web_vitals', { metric_name: 'FCP', value: metric.value }));
  //   getLCP((metric: any) => trackEvent('web_vitals', { metric_name: 'LCP', value: metric.value }));
  //   getTTFB((metric: any) => trackEvent('web_vitals', { metric_name: 'TTFB', value: metric.value }));
  // });
};

// Error tracking
export const trackError = (error: Error, context: string) => {
  trackEvent('javascript_error', {
    event_category: 'error',
    event_label: error.message,
    custom_parameter_1: context,
    custom_parameter_2: error.stack?.substring(0, 500) || 'No stack trace',
  });
};

// Custom analytics API calls (replace with your actual API)
const trackCustomPageView = async (pathname: string) => {
  try {
    await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    console.warn('Failed to track custom page view:', error);
  }
};

const trackCustomEvent = async (eventName: string, parameters: Record<string, any>) => {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        parameters,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.warn('Failed to track custom event:', error);
  }
};

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackEvent,
    trackContactFormSubmission,
    trackProjectView,
    trackSkillInteraction,
    trackResumeDownload,
    trackSocialLinkClick,
    trackSearchQuery,
    trackError,
  };
};