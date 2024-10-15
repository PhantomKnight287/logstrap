import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { client } from '@/lib/api';
import { PageProps } from './$types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export default async function ProjectInfo({ params }: PageProps) {
  const projectStats = await client.GET('/projects/{id}/stats', {
    params: {
      path: {
        id: params.id,
      },
    },
    headers: {
      Authorization: `Bearer ${getAuthToken(cookies())}`,
    },
    revalidate: 60,
  });
  if (projectStats.error)
    redirect(`${Redirects.ERROR}?error=${projectStats.error.message}`);

  const stats = projectStats.data;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center"></div>
      <div className="flex flex-1 items-start justify-start rounded-lg border border-dashed shadow-sm p-4 flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                Total Logs (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-4xl font-bold text-center"
                aria-label={`${stats.logsCount.today} logs today`}
              >
                {stats.logsCount.today}
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <div className="flex items-center text-sm font-medium">
                {stats.logsCount.percentageChange > 0 ? (
                  <ArrowUpIcon
                    className="w-4 h-4 mr-1 text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="w-4 h-4 mr-1 text-red-500"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    stats.logsCount.percentageChange > 0
                      ? 'text-green-500'
                      : 'text-red-500',
                  )}
                >
                  {stats.logsCount.percentageChange}%
                </span>
                <span className="ml-1 text-muted-foreground">
                  {stats.logsCount.percentageChange > 0
                    ? 'increase'
                    : 'decrease'}{' '}
                  from yesterday
                </span>
              </div>
            </CardFooter>
          </Card>
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                Total Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-4xl font-bold text-center"
                aria-label={`${stats.totalLogs} logs`}
              >
                {stats.totalLogs}
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <span className="ml-1 text-muted-foreground text-sm font-medium">
                This includes all logs
              </span>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Show list of most used routes per date and count */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                Most Used Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {stats.mostUsedApiRoute.map((route) => (
                  <li
                    key={route.path}
                    className="flex items-center justify-between gap-4"
                  >
                    <Link
                      href={`/dashboard/${params.id}/api-requests?q=${route.path}`}
                      className="text-sm font-medium underline"
                    >
                      {route.path}
                    </Link>
                    <span>{route.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                Most Frequent Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {stats.mostFrequentAppEvent.map((event, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-4"
                  >
                    <Link
                      href={`/dashboard/${params.id}/app-events?q=${event.event}`}
                      className="text-sm font-medium underline"
                    >
                      {event.event}
                    </Link>
                    <span>{event.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
