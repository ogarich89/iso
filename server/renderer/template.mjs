export const fillTemplate = (template, { head = '', appHtml = '', state = '' }) =>
  template.replace('<!--app-head-->', head).replace('<!--app-html-->', appHtml).replace('<!--app-state-->', state);
