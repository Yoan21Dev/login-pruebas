import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  configureApp,
  configureOpenApi,
  getConfiguration,
} from '@utils/configuration.utils';

async function bootstrap() {
  BigInt.prototype['toJSON'] = function () {
    return String(this);
  };

  const logger = new Logger('Info');
  const app = await configureApp();

  const configService = app.get(ConfigService);
  const configuration = getConfiguration(configService);

  const openApi = configureOpenApi(app, configuration);

  await app.listen(configuration.port, configuration.hostname);

  logger.log(`App running in port ${configuration.port}`);
  logger.log(`App Documentation route is /${openApi.url}`);
}
bootstrap();
