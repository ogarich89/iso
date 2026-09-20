import { errorPage, errorReply } from './error.mjs';

describe('errorPage', () => {
  it('should answer a page request with a readable document', () => {
    const html = errorPage('Internal Server Error');

    expect(html).toContain('<!doctype html>');
    expect(html).toContain('SOMETHING WENT WRONG');
    expect(html).toContain('Internal Server Error');
  });

  it('should escape the message so an error cannot inject markup', () => {
    expect(errorPage('<img src=x onerror="alert(1)">')).not.toContain('<img');
  });
});

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
