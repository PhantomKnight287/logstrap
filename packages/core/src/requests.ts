import { LogsTrapInitOptions } from './types';
import type { components } from './types/api';

export async function logApiRequest(
  input: RequestInfo | URL,
  init: Omit<RequestInit, 'body'>,
  body: components['schemas']['CreateLogDto'],
) {
  return await fetch(input, {
    ...init,
    body: JSON.stringify(body),
  });
}

export async function createEndpointUrl(props: LogsTrapInitOptions) {
  return `${props.endpoint ?? 'https://logstrap-api.procrastinator.fyi'}/projects/${props.projectId}/logs`;
}
