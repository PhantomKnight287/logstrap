import { initLogstrap } from '@logstrap/next';

export const { createRouteHandler, logger, withTracing, withLoggerFactory } =
  initLogstrap({
    apiKey:
      'key_d67ca207066a37189c42412d8603467a40f705de947d73ea50ea9a52b35971d1',
    projectId: 'pj_odp59ho06ob9vlqvblnm6we2',
    endpoint: 'http://localhost:5000',
  });
