let capture: (error: unknown) => void = () => undefined;

export const initMonitoring = async (dsn = import.meta.env.VITE_SENTRY_DSN) => {
  if (!dsn) {
    return;
  }
  const Sentry = await import('@sentry/react');
  Sentry.init({ dsn, environment: import.meta.env.MODE });
  capture = (error) => {
    Sentry.captureException(error);
  };
};

export const captureError = (error: unknown) => {
  capture(error);
};
