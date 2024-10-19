import initLogstrap from '@logstrap/next';

export const { middleware, logger, createRouteHandler } = initLogstrap({
  apiKey: 'key_pyrcts1yks',
  projectId: 'pj_odp59ho06ob9vlqvblnm6we2',
  endpoint: 'http://localhost:5000',
});
