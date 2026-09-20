import type { ComponentType } from 'react';
import { lazy } from 'react';

type ComponentModule = { default: ComponentType<any> };

export type PreloadableComponent = ComponentType<any> & {
  preload: () => Promise<ComponentModule>;
};

export const lazyWithPreload = (loader: () => Promise<unknown>): PreloadableComponent => {
  let promise: Promise<ComponentModule> | undefined;
  let loaded: ComponentModule | undefined;

  const load = () => {
    if (!promise) {
      promise = (loader() as Promise<ComponentModule>).then((module) => {
        loaded = module;
        return module;
      });
    }
    return promise;
  };

  const Lazy = lazy(load);

  const Component = ((props: Record<string, unknown>) => {
    const Resolved = loaded?.default ?? Lazy;
    return <Resolved {...props} />;
  }) as PreloadableComponent;

  Component.preload = load;
  return Component;
};
