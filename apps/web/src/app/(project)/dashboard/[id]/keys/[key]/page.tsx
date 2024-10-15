import { client } from '@/lib/api';
import { PageProps } from './$types';
import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { formatTime } from '../_components/timestamp';
import Back from '@/components/common/back';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import Link from 'next/link';

export default async function ApiKeyPage({ params }: PageProps) {
  const req = await client.GET('/projects/{id}/keys/{keyId}', {
    params: {
      path: {
        id: params.id,
        keyId: params.key,
      },
    },
    headers: {
      Authorization: `Bearer ${getAuthToken(cookies())}`,
    },
    revalidate: 60, // every min
  });
  if (req.error)
    return redirect(`${Redirects.ERROR}?error=${req.error.message}`);

  const key = req.data;
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center p-4">
        <div className="container mb-5 space-y-6">
          <Back url={`/dashboard/${params.id}/keys`} />
          <h1 className="text-2xl font-bold line-clamp-2 mt-2">{key.name}</h1>
          <div className="mt-2 flex items-center flex-row gap-4 text-base flex-wrap justify-center md:justify-start">
            <div className="flex flex-col items-center h-full justify-between">
              <span className="text-muted-foreground">Timestamp</span>
              <Badge variant={'secondary'}>
                {formatTime(key.createdAt, 'DD/MM/YY HH:mm')}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">Mode</span>
              <Badge variant={'secondary'} className="capitalize">
                {key.mode}
              </Badge>
            </div>

            {key.description ? (
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground ">Description</span>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Badge
                      className="text-sm max-w-48 line-clamp-1"
                      variant={'secondary'}
                    >
                      {key.description}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="text-black bg-card-foreground text-muted ">
                    {key.description}
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : null}

            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">API Requests</span>
              <Link
                href={`/dashboard/${params.id}/api-requests?apiKey=${key.id}`}
              >
                <Badge variant={'secondary'} className="underline">
                  {key.apiRequestsCount} Records
                </Badge>
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">App Events</span>
              <Link
                href={`/dashboard/${params.id}/app-events?apiKey=${key.id}`}
              >
                <Badge variant={'secondary'} className="underline">
                  {key.applicationLogsCount} Records
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
