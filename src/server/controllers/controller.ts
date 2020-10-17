import { ParameterizedContext } from 'koa';
import { request, Methods } from '../../shared/api/request';

const controller = (method: Methods) => async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const { query, body } = ctx.request;
    ctx.response.body = await request(method, { ...body, ...query });
  } catch ({ response: { status, data } }) {
    ctx.status = status;
    ctx.response.body = data;
  }
};

export { controller };
