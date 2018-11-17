const product = (params = {}, request) => {
  if (!params.id) {
    return null;
  }
  return request(`/product/${params.id}`).then((product = {}) => product);
};
const products = (params = {}, request) => {
  return request('/products', params).then(products => products);
};

export { product, products };
