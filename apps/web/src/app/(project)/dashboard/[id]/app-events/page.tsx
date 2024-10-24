import { client } from '@/lib/api';
import { Suspense } from 'react';
import { PageProps } from './$types';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import Loading from './loading';
import AppEventsServerPage from './page.server';
import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { AppEventsFilters } from './page.client';
import { searchParamsCache } from './utils';

export default async function AppEventsPage(props: PageProps) {
  const filters = await client.GET(
    '/projects/{id}/application-logs-search-filters',
    {
      params: {
        path: {
          id: (await props.params).id,
        },
      },
      headers: {
        Authorization: `Bearer ${getAuthToken(await cookies())}`,
      },
    },
  );
  if (filters.error) {
    redirect(`${Redirects.ERROR}?error=${filters.error.message}`);
  }
  const { page, fromDate, toDate, apiKey, q, component, functionName, level } =
    searchParamsCache.parse((await props.searchParams));
  const suspenseKey = `${page}-${fromDate}-${toDate}-${apiKey}-${q}-${component}-${functionName}-${level}`;
  return (
    (<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center flex-row justify-between">
        <h1 className="text-lg font-semibold md:text-2xl w-fit">
          Application Events
        </h1>
      </div>
      <AppEventsFilters {...filters.data} />
      <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center size-full">
          <Suspense key={suspenseKey} fallback={<Loading />}>
            <AppEventsServerPage /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
            {...props} />
          </Suspense>
        </div>
      </div>
    </main>)
  );
}
