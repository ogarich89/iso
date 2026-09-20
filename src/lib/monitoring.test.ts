import { captureError, initMonitoring } from 'src/lib/monitoring';

vi.mock('@sentry/react', () => ({ init: vi.fn(), captureException: vi.fn() }));

describe('monitoring', () => {
  it('should swallow errors while no dsn is configured', async () => {
    const { init } = await import('@sentry/react');
    await initMonitoring('');

    expect(() => captureError(new Error('boom'))).not.toThrow();
    expect(init).not.toHaveBeenCalled();
  });

  it('should report to sentry once a dsn is configured', async () => {
    const { captureException, init } = await import('@sentry/react');
    const error = new Error('boom');

    await initMonitoring('https://key@sentry.example.com/1');
    captureError(error);

    expect(init).toHaveBeenCalledWith(expect.objectContaining({ dsn: 'https://key@sentry.example.com/1' }));
    expect(captureException).toHaveBeenCalledWith(error);
  });
});
