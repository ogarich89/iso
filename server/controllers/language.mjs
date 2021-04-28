export const language = async (ctx) => {
  const { body: { lng } } = ctx.request;
  ctx.session.lng = lng;
  ctx.response.body = { message: 'Language is changed' };
};
