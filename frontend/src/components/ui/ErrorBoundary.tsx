'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Generate error ID
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, eventId);
    }
  }

  private logErrorToService = async (error: Error, errorInfo: React.ErrorInfo, eventId: string) => {
    try {
      // In production, send to error tracking service
      // Example: Sentry, LogRocket, Bugsnag, etc.
      
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        eventId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'anonymous', // Would get from auth context
      };

      // Example API call (replace with your error tracking service)
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silent fail - don't let error reporting break the error boundary
      });
    } catch (e) {
      console.warn('Failed to log error to service:', e);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: null,
      });
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const { error, errorInfo, eventId } = this.state;
    const subject = encodeURIComponent(`Error Report - ${eventId}`);
    const body = encodeURIComponent(`
Hi,

I encountered an error on your website:

Error ID: ${eventId}
Error Message: ${error?.message}
Page: ${window.location.href}
Time: ${new Date().toLocaleString()}

Additional Information:
${error?.stack}

Please let me know if you need any additional information.

Best regards
    `.trim());

    window.open(`/contact?subject=${subject}&message=${body}`, '_blank');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Error Icon */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </motion.div>

            {/* Error Message */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. The error has been logged 
                and we'll look into it.
              </p>

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mt-4 p-3 bg-white border border-red-300 rounded">
                  <summary className="cursor-pointer font-medium text-red-700 hover:text-red-900">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 text-sm">
                    <div className="font-medium text-red-800">Error:</div>
                    <div className="text-red-700 font-mono text-xs mb-2">
                      {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <>
                        <div className="font-medium text-red-800">Stack Trace:</div>
                        <pre className="text-red-700 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {this.retryCount < this.maxRetries && (
                  <button
                    onClick={this.handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again ({this.maxRetries - this.retryCount} left)
                  </button>
                )}
                
                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              <button
                onClick={this.handleReportError}
                className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Report This Error
              </button>
            </div>

            {/* Error ID */}
            {this.state.eventId && (
              <div className="mt-4 text-xs text-gray-500 font-mono">
                Error ID: {this.state.eventId}
              </div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Uncaught error:', error);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      // errorTrackingService.captureException(error);
    }
  }, []);

  return handleError;
};

// Higher-order component version
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;