import { isExternal, pathResolver } from './index';

describe('isExternal', () => {
  it('should return true', () => {
    expect(isExternal('http://test.com')).toBe(true);
  });
});

describe('pathResolver', () => {
  it('should return correct absolute path', () => {
    expect(pathResolver('users', '1', 'edit')).toBe('/users/1/edit');
  });

  it('should return correct URL address', () => {
    expect(pathResolver('https://iso.js', '/users/', '/1', 'edit/')).toBe(
      'https://iso.js/users/1/edit'
    );
  });

  it('should return correct URL address with search', () => {
    expect(
      pathResolver('https://iso.js', '/users/', '/1', 'edit/', {
        lang: 'ru',
      })
    ).toBe('https://iso.js/users/1/edit?lang=ru');
  });

  it('should construct correct URL from mixed options', () => {
    expect(
      pathResolver(
        '/users/',
        'https://iso.js/',
        '/1///',
        {
          lang: 'ru',
        },
        '///edit/',
        {
          theme: 'dark',
        }
      )
    ).toBe('https://iso.js/users/1/edit?lang=ru&theme=dark');
  });

  it('should resolve path and return correct URL', () => {
    expect(
      pathResolver('https://iso.js', 'users', '1', 'edit', '../../', {
        id: '1',
      })
    ).toBe('https://iso.js/users?id=1');
  });

  it('should replace params and return correct absolute path', () => {
    expect(
      pathResolver('/api/users/:id/edit', {
        id: '65345',
        lang: 'en',
      })
    ).toBe('/api/users/65345/edit?lang=en');
  });

  it('should replace params and return correct URL', () => {
    expect(
      pathResolver('https://iso.js', '/users/:id/products/:product_id', {
        id: '5',
        product_id: '65345',
        lang: 'en',
      })
    ).toBe('https://iso.js/users/5/products/65345?lang=en');
  });
});
