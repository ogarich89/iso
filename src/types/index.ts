import type { LoadableClassComponent } from '@loadable/component';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FunctionComponent } from 'react';
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
  }): Promise<Data>;
}

export type Request = {
  session: {
    lng: Languages;
    get(key: string): string;
    set(key: string, value: string): void;
  };
} & FastifyRequest;

export type Reply = {
  view: (path: string, options: Record<string, unknown>) => Promise<string>;
} & FastifyReply;

type Languages = 'en' | 'ru';

export interface Schema {
  product: Product;
  products: Products;
}

export type PageComponent<Data> = FunctionComponent<{
  initialAction: InitialAction<Data>;
}>;

export type State<Data> = [RecoilState<Data | null>, Data | null];

export interface ExpandRoute {
  path: string;
  initialActions: InitialAction<Array<State<any>>>[];
}

export interface PageRoute {
  initialAction: InitialAction<State<any>[]>;
  path: string;
  component: LoadableClassComponent<any>;
  children?: PageRoute[];
}
