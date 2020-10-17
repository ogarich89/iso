import i18next from 'i18next';

export type I18next = typeof i18next;

declare global {
    interface Window {
        __initialData__: any;
        initialLanguage: string;
        initialI18nStore: Record<string, any>;
    }
}

export interface IProduct {
    id: number,
    color: string,
    pantone_value: string,
    year: number,
    name: string
}

export interface IStore {
    products: {
        products: IProduct[],
        product: IProduct
    }
}

export type Language = 'ru' | 'en';




