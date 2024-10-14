import { client } from '@/lib/api';
import { PageProps } from './$types';
import { cookies } from 'next/headers';
import { getAuthToken } from '@/utils/get-cookie';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import Back from '@/components/common/back';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '../../keys/_components/timestamp';
import { LogLevelBadge } from '@/components/badges';
import Code from '@/components/code';

export default async function AppEventLog(props: PageProps) {
  const req = await client.GET('/projects/{id}/application-logs/{logId}', {
    params: {
      path: {
        id: props.params.id,
        logId: props.params.log,
      },
    },
    headers: {
      Authorization: `Bearer ${getAuthToken(cookies())}`,
    },
  });
  if (req.error) {
    redirect(`${Redirects.ERROR}?error=${req.error.message}`);
  }
  const log = req.data;
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4">
      <div className="container mb-5 space-y-6">
        <Back url={`/dashboard/${props.params.id}/app-events`} />
        <h1 className="text-2xl font-bold line-clamp-2 mt-2">{log.message}</h1>
        <div className="mt-2 flex items-center flex-row gap-4 text-base flex-wrap justify-center md:justify-start">
          <div className="flex flex-col items-center h-full justify-between">
            <span className="text-muted-foreground">Timestamp</span>
            <Badge variant={'secondary'}>
              {formatTime(log.timestamp, 'DD/MM/YY HH:mm')}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground ">Level</span>
            <LogLevelBadge level={log.level} />
          </div>
        </div>
        {log.additionalInfo?.stack ? (
          <div className="flex flex-col items-start gap-2">
            <span className="text-muted-foreground">Stack</span>
            <Code
              lang="bash"
              code={log.additionalInfo?.stack}
              theme="ayu-dark"
            />
          </div>
        ) : null}
        <div className="flex flex-col items-start gap-2">
          <span className="text-muted-foreground">Additional Info</span>
          <Code
            lang="json"
            code={JSON.stringify(
              log.additionalInfo
                ? { ...log.additionalInfo, stack: undefined }
                : null,
              null,
              2,
            )}
            theme="ayu-dark"
          />
        </div>
      </div>
    </div>
  );
}
