import type { FastifyReply, FastifyRequest } from 'fastify';
import type { RecoilState } from 'recoil';

declare global {
  interface Window {
    __initialData__: any;
    initialLanguage: string;
    initialI18nStore: Record<string, any>;
  }
}

export interface Product {
  id: number;
  color: string;
  pantone_value: string;
  year: number;
  name: string;
}

export type Products = Product[];

export interface InitialAction<Data> {
  (req?: Pick<FastifyRequest, 'url'>): Promise<
    Array<[RecoilState<Data>, Data]>
  >;
}

export interface Request extends FastifyRequest {
  session: {
    lng: string;
    get(key: string): string;
    set(key: string, value: string): void;
  };
}

export interface Reply extends FastifyReply {
  view: (path: string, options: Record<string, unknown>) => Promise<string>;
}
