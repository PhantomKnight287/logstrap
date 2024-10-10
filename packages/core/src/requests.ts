import { LOGSTRAP_API_URL } from '@logstrap/constants';
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
  return `${props.endpoint ?? LOGSTRAP_API_URL}/projects/${props.projectId}/logs`;
}
