export const language = async (request) => {
  const {
    body: { lng },
  } = request;
  request.session.set('lng', lng);
  return { message: 'Language is changed' };
};
