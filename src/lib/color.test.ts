import { isLightColor } from 'src/lib/color';

describe('isLightColor', () => {
  it('should read light product colours', () => {
    expect(isLightColor('#98B2D1')).toBe(true);
    expect(isLightColor('#7BC4C4')).toBe(true);
    expect(isLightColor('#E2583E')).toBe(true);
  });

  it('should read dark product colours', () => {
    expect(isLightColor('#BF1932')).toBe(false);
    expect(isLightColor('#C74375')).toBe(false);
    expect(isLightColor('#000000')).toBe(false);
  });

  it('should accept a colour without the hash', () => {
    expect(isLightColor('ffffff')).toBe(true);
  });
});
