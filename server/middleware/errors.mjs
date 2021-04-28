const errors = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      console.error(e);
    }
  };
};

export { errors };
