import type { DehydratedState, QueryClient } from '@tanstack/react-query';
import type { FastifyRequest } from 'fastify';
import type { PreloadableComponent } from 'src/lib/lazyWithPreload';

declare global {
  interface Window {
    __QUERY_STATE__: DehydratedState;
    initialLanguage: string;
    initialI18nStore: Record<string, any>;
  }
}

export interface ServerRequest {
  url: FastifyRequest['url'];
  headers?: FastifyRequest['headers'];
}

export type Prefetch = (
  queryClient: QueryClient,
  context: { params: Record<string, string | undefined>; req?: ServerRequest },
) => Promise<unknown> | unknown;

export interface PageRoute {
  path: string;
  modulePath: string;
  component: PreloadableComponent;
  prefetch?: Prefetch;
  delay?: number;
  children?: PageRoute[];
}

export interface ExpandRoute {
  path: string;
  prefetches: Prefetch[];
  modulePaths: string[];
  components: PreloadableComponent[];
}
