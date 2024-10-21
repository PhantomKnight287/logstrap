import { describe, it, expect, vi } from 'vitest';
import { logApiRequest, createEndpointUrl } from '../src/requests';
import { LOGSTRAP_API_URL } from '@logstrap/constants';
import type { components } from '../src/types/api';
import type { LogsTrapInitOptions } from '../src/types';

// Mock fetch globally
global.fetch = vi.fn();

describe('logApiRequest', () => {
  it('should call fetch with correct parameters', async () => {
    const input = 'https://api.example.com/logs';
    const init: Omit<RequestInit, 'body'> = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    const body: components['schemas']['CreateLogDto'] = {
      applicationLogs: [
        {
          level: 'debug',
          message: 'Hello World',
        },
      ],
    };

    await logApiRequest(input, init, body);

    expect(fetch).toHaveBeenCalledWith(input, {
      ...init,
      body: JSON.stringify(body),
    });
  });
});

describe('createEndpointUrl', () => {
  it('should create correct URL with custom endpoint', async () => {
    const props: LogsTrapInitOptions = {
      projectId: 'test-project',
      apiKey: 'test-api-key',
      endpoint: 'https://localhost:5000',
    };

    const result = await createEndpointUrl(props);

    expect(result).toBe('https://localhost:5000/projects/test-project/logs');
  });

  it('should create correct URL with default endpoint', async () => {
    const props: LogsTrapInitOptions = {
      projectId: 'test-project',
      apiKey: 'test-api-key',
    };

    const result = await createEndpointUrl(props);

    expect(result).toBe(`${LOGSTRAP_API_URL}/projects/test-project/logs`);
  });
});
