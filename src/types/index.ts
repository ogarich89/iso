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
  (req?: {
    url: FastifyRequest['url'];
    headers?: FastifyRequest['headers'];
  }): Promise<Array<[RecoilState<Data>, Data]>>;
}

export interface Request extends FastifyRequest {
  session: {
    lng: Languages;
    get(key: string): string;
    set(key: string, value: string): void;
  };
}

export interface Reply extends FastifyReply {
  view: (path: string, options: Record<string, unknown>) => Promise<string>;
}

type Languages = 'en' | 'ru';

export interface Schema {
  product: Product;
  products: Products;
}
