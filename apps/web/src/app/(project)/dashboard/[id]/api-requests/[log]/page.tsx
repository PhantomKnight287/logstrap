import { getAuthToken } from '@/utils/get-cookie';
import { PageProps } from './$types';
import { cookies } from 'next/headers';
import { getCachedApiRequestLog } from './cache';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';

import { formatTime } from '../../keys/_components/timestamp';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Back from '@/components/common/back';
import LogInfoPage from './page.client';
import { components } from '@/lib/api/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RequestMethodBadge, StatusCodeBadge } from '@/components/badges';

export default async function ApiRequestLog(props: PageProps) {
  const data = await getCachedApiRequestLog(
    props.params.log,
    props.params.id,
    getAuthToken(cookies()),
  );
  if (data.error) {
    redirect(`${Redirects.ERROR}?error=${data.error.message}`);
  }
  const log = data.data;
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4">
      <div className="container mb-5 space-y-6">
        <Back
          url={`/dashboard/${log.projectId}/api-requests`}
          backOnEscape={true}
        />
        <h1 className="text-2xl font-bold line-clamp-2 mt-2">
          {log.method} {log.url}
        </h1>
        <div className="mt-2 flex items-center flex-row gap-4 text-base flex-wrap justify-center md:justify-start">
          <div className="flex flex-col items-center h-full justify-between">
            <span className="text-muted-foreground">Timestamp</span>
            <Badge variant={'secondary'}>
              {formatTime(log.timestamp, 'DD/MM/YY HH:mm')}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground ">Method</span>
            <RequestMethodBadge method={log.method} />
          </div>
          {log.statusCode ? (
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">Status</span>
              <StatusCodeBadge statusCode={log.statusCode} />
            </div>
          ) : null}
          {log.ip ? (
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">IP</span>
              <Badge className="text-sm" variant={'secondary'}>
                {log.ip}
              </Badge>
            </div>
          ) : null}
          {log.userAgent ? (
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">User Agent</span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Badge
                    className="text-sm max-w-48 line-clamp-1"
                    variant={'secondary'}
                  >
                    {log.userAgent}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="text-black bg-card-foreground text-muted ">
                  {log.userAgent}
                </TooltipContent>
              </Tooltip>
            </div>
          ) : null}
        </div>
        {/* {log.message ? (
          <Callout title={log.name || "Error"} type="error">
            {log.message}
          </Callout>
        ) : null} */}

        <LogInfoPage data={log} />
        {log.applicationLogs?.length ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Logs</h2>
            <div className="flex flex-col gap-4 bg-secondary p-4 rounded-md font-mono">
              {log.applicationLogs.map((log) => (
                <LogItem key={log.id} log={log} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LogItem({
  log,
}: {
  log: components['schemas']['ApplicationLogEntity'];
}) {
  return (
    <div
      className={cn('p-2 py-0 rounded-md bg-secondary', {
        'text-red-500': log.level === 'error',
        'text-blue-400': log.level === 'info',
        'text-yellow-400': log.level === 'warn',
        'text-purple-400': log.level === 'debug',
        'text-red-600 font-bold': log.level === 'fatal',
        'text-gray-400': log.level === 'trace',
      })}
    >
      {formatTime(log.timestamp, 'DD/MM/YY HH:mm')} - [{log.level}] [
      {log.component ? `${log.component} → ` : ''}
      {log.functionName ?? ''}] {log.message}
    </div>
  );
}
