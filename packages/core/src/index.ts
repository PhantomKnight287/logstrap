import type { LogsTrapInitOptions } from './types/index';
import Logger from './logger';
import { components } from './types/api';
export default class LogsTrap {
  protected apiKey: string;
  protected projectId: string;
  protected endpoint: string;

  logger: Logger;
  constructor({ apiKey, projectId, endpoint }: LogsTrapInitOptions) {
    this.apiKey = apiKey;
    this.endpoint = `${endpoint ?? 'https://logstrap-api.procrastinator.fyi'}/projects/${projectId}/logs`;
    this.projectId = projectId;

    this.logger = new Logger();
  }
}

export { generateId, getCrypto } from './utils';
export type { LogsTrapInitOptions } from './types';
export { logApiRequest, createEndpointUrl } from './requests';
