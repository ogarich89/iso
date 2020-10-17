import { ParameterizedContext } from 'koa';

export const language = async (ctx: ParameterizedContext): Promise<void> => {
  const { body: { lng } } = ctx.request;
  ctx.session.lng = lng;
  ctx.response.body = { message: 'Language is changed' };
};
