const GENERIC_MESSAGE = 'Internal Server Error';

const serverErrorBody = (error, isProduction) => {
  if (isProduction) {
    return { message: GENERIC_MESSAGE };
  }
  const { message = String(error), stack } = error || {};
  return stack ? { message, stack } : { message };
};

export const errorReply = (error, isProduction) => {
  const status = Number(error?.statusCode);
  if (status >= 400 && status < 500) {
    return { status, body: { message: error.message } };
  }
  return { status: 500, body: serverErrorBody(error, isProduction) };
};
