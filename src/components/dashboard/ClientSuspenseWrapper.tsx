'use client';

import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientSuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

const DefaultFallback = () => (
  <Card className="h-full animate-pulse">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorFallback = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2 text-red-600">
        <AlertTriangle className="h-5 w-5" />
        <span>Component Error</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Something went wrong while loading this component.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="w-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

class ErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error || new Error('Unknown error')}
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
            this.props.onRetry();
          }}
        />
      );
    }

    return this.props.children;
  }
}

export function ClientSuspenseWrapper({ children, fallback }: ClientSuspenseWrapperProps) {
  const [retryKey, setRetryKey] = React.useState(0);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <ErrorBoundary onRetry={handleRetry}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        <div key={retryKey}>
          {children}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
