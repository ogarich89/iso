export const language = async (request, reply) => {
  const {
    body: { lng },
  } = request;
  request.session.lng = lng;
  reply.send({ message: 'Language is changed' });
};
