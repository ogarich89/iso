import health from './routes/health.mjs';
import language from './routes/language.mjs';

const routes = [...language, ...health];

export { routes };
