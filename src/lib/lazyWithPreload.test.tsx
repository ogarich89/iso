import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { lazyWithPreload } from 'src/lib/lazyWithPreload';

const module = () => ({ default: () => <span>content</span> });

describe('lazyWithPreload', () => {
  it('should load the module once', async () => {
    const loader = vi.fn(async () => module());
    const Component = lazyWithPreload(loader);

    const promise = Component.preload();

    expect(Component.preload()).toBe(promise);
    await expect(promise).resolves.toHaveProperty('default');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('should render synchronously once preloaded', async () => {
    const Component = lazyWithPreload(async () => module());

    await Component.preload();
    const { container } = render(
      <Suspense fallback={<span>fallback</span>}>
        <Component />
      </Suspense>,
    );

    expect(container.textContent).toBe('content');
  });

  it('should suspend until the module is loaded when it was not preloaded', async () => {
    const Component = lazyWithPreload(async () => module());

    render(
      <Suspense fallback={<span>fallback</span>}>
        <Component />
      </Suspense>,
    );

    expect(screen.getByText('fallback')).toBeTruthy();
    expect(await screen.findByText('content')).toBeTruthy();
  });
});
