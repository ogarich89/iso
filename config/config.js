const { env: { NODE_ENV } } = process;
const dirname = NODE_ENV !== 'production' && NODE_ENV !== 'staging' ? 'development' : NODE_ENV;
import { CustomError } from '../src/shared/helpers';

let server;
try {
  server = require(`./${dirname}/server.json`);
} catch (e) {
  throw new CustomError({ message: `Не найден конфигурационный файл (/config/${dirname}/server.json). Ознакомтесь с инструкцией /config/__example__/readme.txt` });
}

export default { server };
