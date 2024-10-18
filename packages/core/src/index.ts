import type { LogsTrapInitOptions } from './types/index';
import Logger from './logger';
import { LOGSTRAP_API_URL } from '@logstrap/constants';

export default class LogsTrap {
  protected apiKey: string;
  protected projectId: string;
  protected endpoint: string;

  logger: Logger;
  constructor({ apiKey, projectId, endpoint }: LogsTrapInitOptions) {
    this.apiKey = apiKey;
    this.endpoint = `${endpoint ?? LOGSTRAP_API_URL}/projects/${projectId}/logs`;
    this.projectId = projectId;

    this.logger = new Logger();
  }
}

export { generateId, getCrypto } from './utils';
export type { LogsTrapInitOptions } from './types';
export { logApiRequest, createEndpointUrl } from './requests';
