import { LoggerOptions } from 'winston';

import { LogsTrapInitOptions } from './types';
import Logger from './logger';
export default class LogsTrap {
  protected apiKey: string;
  protected projectId: string;
  protected endpoint: string;

  logger: Logger;
  constructor(
    { apiKey, projectId, endpoint }: LogsTrapInitOptions,
    loggingOptions: LoggerOptions,
  ) {
    this.apiKey = apiKey;
    this.endpoint = `${endpoint ?? 'https://logstrap-api.procrastinator.fyi'}/projects/${projectId}/logs`;
    this.projectId = projectId;

    this.logger = new Logger();
    
  }
}
