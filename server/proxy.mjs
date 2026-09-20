export const proxyHeaders = (apiKey) => (_request, headers) => {
  const forwarded = Object.fromEntries(Object.entries(headers).filter(([name]) => name.toLowerCase() !== 'cookie'));
  return apiKey ? { ...forwarded, 'x-api-key': apiKey } : forwarded;
};
