import { PageProps } from './$types';

import { Suspense } from 'react';
import ApiRequestsServer from './page.server';
import Loading from './loading';
import { client } from '@/lib/api';
import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';

import { ApiRequestFilters } from './page.client';
import { searchParamsCache } from './utils';

export const dynamic = 'force-dynamic';

export default async function ApiRequests(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { apiKey, fromDate, method, page, q, statusCode, toDate } =
    searchParamsCache.parse(searchParams);
  const suspenseKey = `${page}-${method}-${statusCode}-${fromDate}-${toDate}-${apiKey}-${q}`;
  const filters = await client.GET(
    '/projects/{id}/api-request-search-filters',
    {
      params: {
        path: {
          id: params.id,
        },
      },
      headers: {
        Authorization: `Bearer ${getAuthToken(await cookies())}`,
      },
      fetch: (request: unknown) => {
        return fetch(request as Request, { next: { revalidate: 10 } });
      },
    },
  );
  if (filters.error) {
    redirect(`${Redirects.ERROR}?error=${filters.error.message}`);
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center flex-row justify-between">
        <h1 className="text-lg font-semibold md:text-2xl w-fit">
          API Requests
        </h1>
      </div>
      <ApiRequestFilters {...filters.data} />
      <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center size-full">
          <Suspense key={suspenseKey} fallback={<Loading />}>
            <ApiRequestsServer params={params} searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
