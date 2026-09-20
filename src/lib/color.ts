const LIGHT_THRESHOLD = 0.179;

const channel = (value: number) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

const luminance = (hex: string) => {
  const value = hex.replace('#', '');
  const [red, green, blue] = [0, 2, 4].map((offset) =>
    channel(Number.parseInt(value.slice(offset, offset + 2), 16) / 255),
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const isLightColor = (hex: string) => luminance(hex) > LIGHT_THRESHOLD;
