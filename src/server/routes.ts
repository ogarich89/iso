import type { ParameterizedContext } from 'koa';
import language from './routes/language';

interface Route {
  method: 'get' | 'post' | 'patch' | 'delete';
  path: string;
  controller: (ctx: ParameterizedContext) => any;
}

export type Routes = Route[];

const routes: Routes = [
  ...language
];

export { routes };
