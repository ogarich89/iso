declare module 'i18next-fetch-backend';
declare module 'i18next-node-remote-backend';
declare const isDevelopment: boolean;
declare const timestamp: number;

declare module '*.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
  import type { FunctionComponent, SVGAttributes } from 'react';
  const content: FunctionComponent<SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}
