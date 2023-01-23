export const isExternal = (url: string): boolean => {
  return /^(http:\/\/|https:\/\/|\/\/)/.test(url);
};

export const DATE_FORMAT = 'DD.MM.YYYY HH:mm';
