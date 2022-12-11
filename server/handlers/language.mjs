export const language = async (request, reply) => {
  const {
    body: { lng },
  } = request;
  request.session.set('lng', lng);
  reply.send({ message: 'Language is changed' });
};
