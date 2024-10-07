import { client } from '@/lib/api';
import { memoize } from 'nextjs-better-unstable-cache';

export const getCachedApiKeys = memoize(
  async (projectId: string, token: string) => {
    const req = await client.GET('/projects/{id}/keys', {
      params: {
        path: {
          id: projectId,
        },
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return req;
  },
  {
    duration: 60,
    revalidateTags: (projectId) => [`api-keys::${projectId}`],
    log: ['datacache', 'dedupe', 'verbose'],
  },
);
