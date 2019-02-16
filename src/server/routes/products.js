const products = async ctx => {
  ctx.response.body = await ctx.api.fetch('products', ctx.query);
};
const product = async ctx => {
  ctx.response.body = await ctx.api.fetch('product', ctx.query);
};

export { products, product };

