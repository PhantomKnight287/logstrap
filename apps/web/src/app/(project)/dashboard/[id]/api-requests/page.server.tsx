import { client } from '@/lib/api';
import { PageProps } from './$types';
import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { NextPage, PreviousPage } from './page.client';
import { searchParamsCache } from './utils';

export default async function ApiRequestsServer({
  params,
  searchParams,
}: PageProps) {
  const { apiKey, fromDate, method, page, q, statusCode, toDate } =
    searchParamsCache.parse(searchParams);
  const logs = await client.GET('/projects/{id}/request-logs', {
    params: {
      path: {
        id: params.id,
      },
      query: {
        page: page.toString(),
        limit: '50',
        apiKey: apiKey ?? undefined,
        fromDate: fromDate ?? undefined,
        toDate: toDate ?? undefined,
        method: method ?? undefined,
        q: q ?? undefined,
        statusCode: statusCode ?? undefined,
      },
    },
    headers: {
      Authorization: `Bearer ${getAuthToken(cookies())}`,
    },
  });
  if (logs.error) {
    redirect(`${Redirects.ERROR}?error=${logs.error.message}`);
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <DataTable columns={columns} data={logs.data.items} className="w-full" />
      <div className="flex flex-row gap-2">
        <PreviousPage disabled={page === 1} page={page} />
        <NextPage
          disabled={page * logs.data.itemsPerQuery >= logs.data.totalItems}
          page={page}
        />
      </div>
    </div>
  );
}
