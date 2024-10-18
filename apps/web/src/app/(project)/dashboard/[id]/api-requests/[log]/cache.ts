import { client } from '@/lib/api';
import { memoize } from 'nextjs-better-unstable-cache';

export const getCachedApiRequestLog = memoize(
  async (logId: string, projectId: string, token: string) => {
    const data = await client.GET(`/projects/{id}/request-logs/{logId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        path: {
          id: projectId,
          logId,
        },
      },
    });
    return data;
  },
  {
     
    log: ['datacache', 'dedupe', 'verbose'],
    revalidateTags(logId, projectId) {
      return [`api-request-log::${projectId}::${logId}`];
    },
  },
);
