'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // errorTrackingService.captureException(error);
    }
  }, [error]);

  const handleReset = () => {
    // Clear any client-side cache or state if needed
    if (typeof window !== 'undefined') {
      // Clear localStorage errors
      localStorage.removeItem('error-boundary-count');
    }
    reset();
  };

  const goHome = () => {
    window.location.href = '/';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as any
      }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as any
      }
    }
  };

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <motion.div
            className="text-center max-w-lg mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Error Icon */}
            <motion.div
              className="mb-8 flex justify-center"
              variants={iconVariants}
              initial="initial"
              animate="animate"
            >
              <div className="p-6 bg-red-100 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </motion.div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Something went wrong!
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                We're sorry, but something unexpected happened. This error has been logged 
                and we'll look into it.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer font-medium text-red-600 hover:text-red-800 transition-colors">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <pre className="text-sm text-red-800 overflow-x-auto">
                      {error.message}
                      {error.stack && (
                        <div className="mt-2 text-xs">
                          Stack trace:
                          <div className="mt-1 font-mono">
                            {error.stack}
                          </div>
                        </div>
                      )}
                    </pre>
                  </div>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                
                <button
                  onClick={goHome}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              <div className="text-sm text-gray-500">
                If the problem persists, please contact support
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Report This Issue
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Help us improve by reporting this error. Include what you were doing when this happened.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Contact Support
              </a>
            </div>

            {/* Error ID */}
            {error.digest && (
              <div className="mt-6 text-xs text-gray-400 font-mono">
                Error ID: {error.digest}
              </div>
            )}
          </motion.div>

          {/* Background Pattern */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
            <div className="absolute inset-0">
              <div className="grid grid-cols-8 gap-4 h-full">
                {[...Array(64)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-red-200 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: Math.random() * 0.5 }}
                    transition={{
                      duration: 2,
                      delay: i * 0.01,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}