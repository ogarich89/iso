const translation = {
  t: (key) => key.split(':')[1] || key,
  i18n: { language: 'en' },
};

module.exports = {
  useTranslation: () => translation,
};
