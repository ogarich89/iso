const GENERIC_MESSAGE = 'Internal Server Error';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ESCAPES[character]);

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

export const errorPage = (message) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Something went wrong</title>
  </head>
  <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #343434">
    <strong style="font-size: 2rem">SOMETHING WENT WRONG</strong>
    <p style="color: #4d4d4d">${escapeHtml(message)}</p>
    <a href="/" style="color: #008080">Back to the home page</a>
  </body>
</html>`;
