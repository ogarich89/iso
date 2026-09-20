import type { ComponentType } from 'react';
import { lazy } from 'react';

type ComponentModule = { default: ComponentType<any> };

export type PreloadableComponent = ReturnType<typeof lazy> & {
  preload: () => Promise<ComponentModule>;
};

export const lazyWithPreload = (loader: () => Promise<unknown>): PreloadableComponent => {
  let promise: Promise<ComponentModule> | undefined;

  const load = () => {
    if (!promise) {
      promise = loader() as Promise<ComponentModule>;
    }
    return promise;
  };

  const Component = lazy(load) as PreloadableComponent;
  Component.preload = load;
  return Component;
};
