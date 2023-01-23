import { isExternal } from './index';

test('test', () => {
  expect(isExternal('http://test.com')).toBe(true);
});
