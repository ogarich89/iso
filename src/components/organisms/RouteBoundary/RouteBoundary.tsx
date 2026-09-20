import type { FunctionComponent, ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router';
import { PageError } from 'src/components/molecules/PageError/PageError';
import { captureError } from 'src/lib/monitoring';

const Fallback: FunctionComponent<FallbackProps> = ({ resetErrorBoundary }) => (
  <PageError onRetry={resetErrorBoundary} />
);

export const RouteBoundary: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary FallbackComponent={Fallback} onError={captureError} resetKeys={[pathname]}>
      {children}
    </ErrorBoundary>
  );
};
