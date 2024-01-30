import type { LoadableClassComponent } from '@loadable/component';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FunctionComponent } from 'react';

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

export type InitialAction = AsyncThunk<any, any, any>;

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

export type PageComponent = FunctionComponent<{
  initialAction: InitialAction;
}>;

export interface ExpandRoute {
  path: string;
  initialActions: InitialAction[];
}

export interface PageRoute {
  initialAction: InitialAction;
  path: string;
  component: LoadableClassComponent<any>;
  children?: PageRoute[];
}
