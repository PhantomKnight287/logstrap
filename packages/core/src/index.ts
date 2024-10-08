import { LogsTrapInitOptions } from './types';

export class LogsTrap {
  protected apiKey: string;
  protected projectId: string;
  protected endpoint: string;
  constructor({ apiKey, projectId, endpoint }: LogsTrapInitOptions) {
    this.apiKey = apiKey;
    this.endpoint = `${endpoint ?? 'https://logstrap-api.procrastinator.fyi'}/projects/${projectId}/logs`;
    this.projectId = projectId;
  }
}
