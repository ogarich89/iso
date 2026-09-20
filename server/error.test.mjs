import { errorReply } from './error.mjs';

describe('errorReply', () => {
  it('should hide the details of a server error in production', () => {
    const error = new Error('connect ECONNREFUSED 10.0.0.7:6379');

    expect(errorReply(error, true)).toEqual({ status: 500, body: { message: 'Internal Server Error' } });
  });

  it('should expose a server error while developing', () => {
    const error = new Error('boom');

    expect(errorReply(error, false)).toEqual({ status: 500, body: { message: 'boom', stack: error.stack } });
  });

  it('should describe a thrown value that is not an error', () => {
    expect(errorReply('boom', false)).toEqual({ status: 500, body: { message: 'boom' } });
  });

  it('should keep the status and message of a bad request', () => {
    const error = Object.assign(new Error('body must have required property lng'), { statusCode: 400 });

    expect(errorReply(error, true)).toEqual({ status: 400, body: { message: 'body must have required property lng' } });
  });
});
