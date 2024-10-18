import { client } from '@/lib/api';
import { memoize } from 'nextjs-better-unstable-cache';
export const getCachedProjectDetails = memoize(
  async (projectId: string, token: string) => {
    const req = await client.GET('/projects/{id}', {
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
    revalidateTags: (projectId) => [`project::${projectId}`],
    log: ['datacache', 'dedupe', 'verbose'],
  },
);
