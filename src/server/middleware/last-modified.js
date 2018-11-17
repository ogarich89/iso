import client from '../libs/redis-client';

const lastModified = () => {
  return async (ctx, next) => {
    if (ctx.get('x-requested-with')) {
      return next();
    }
    const { response, request } = ctx;
    const data = await client.get('last_modify_data').catch(next);
    const lastModify = data ? new Date(data) : new Date();
    response.set('Last-Modified', lastModify.toUTCString());
    if (request.get('if-modified-since')) {
      const modifiedSince = new Date(request.get('if-modified-since'));
      if (modifiedSince >= lastModify) {
        response.throw(304, 'Not Modified');
      }
    }
    return next();
  };
};

export { lastModified };
