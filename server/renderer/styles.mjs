const CSS_RE = /\.(css|scss|sass|less|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

const isCssModule = (url) => Boolean(url) && CSS_RE.test(url);

const withDirectQuery = (url) => {
  const [path, query = ''] = url.split('?');
  const params = new URLSearchParams(query);
  params.set('direct', '');
  return `${path}?${params.toString()}`;
};

export const collectSsrStyles = async (server) => {
  const graph = server.environments?.ssr?.moduleGraph ?? server.moduleGraph;
  const client = server.environments?.client ?? server;
  const seen = new Set();
  const styles = [];

  for (const mod of graph.idToModuleMap?.values?.() ?? []) {
    if (!isCssModule(mod.url) || seen.has(mod.url)) {
      continue;
    }
    seen.add(mod.url);
    try {
      const result = await client.transformRequest(withDirectQuery(mod.url));
      if (result?.code) {
        styles.push(result.code);
      }
    } catch {}
  }

  return styles.join('\n');
};

export const renderStyleTag = (css) => (css ? `<style type="text/css">${css}</style>` : '');
