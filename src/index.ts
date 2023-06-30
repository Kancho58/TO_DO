import app from './app';
import logger from './untils/logger';
import config from './config/config';
import nodeErrorHandler from './middlewares/nodeErrorHandler';

const { port, host } = config;
app
  .listen(+port, host, () => {
    logger.log('info', `Server started at http://${host}:${port}`);
  })
  .on('error', nodeErrorHandler);
