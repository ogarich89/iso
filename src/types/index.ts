import type { FastifyRequest } from 'fastify';
import type { FunctionComponent } from 'react';
import type { PreloadableComponent } from 'src/lib/lazyWithPreload';
import type { AppStore, State } from 'src/store';

declare global {
  interface Window {
    __initialData__: Partial<State>;
    initialLanguage: string;
    initialI18nStore: Record<string, any>;
  }
}

export interface InitialActionRequest {
  url: string;
  headers?: FastifyRequest['headers'];
}

export type InitialAction = (store: AppStore, req?: InitialActionRequest) => Promise<void> | void;

export type ResetAction = (store: AppStore) => void;

export type PageComponent = FunctionComponent<{
  initialAction: InitialAction;
}>;

export interface PageRoute {
  path: string;
  modulePath: string;
  component: PreloadableComponent;
  initialAction: InitialAction;
  delay?: number;
  children?: PageRoute[];
}

export interface ExpandRoute {
  path: string;
  initialActions: InitialAction[];
  modulePaths: string[];
  components: PreloadableComponent[];
}
