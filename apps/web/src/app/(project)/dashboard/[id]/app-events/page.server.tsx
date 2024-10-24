import { getAuthToken } from '@/utils/get-cookie';
import { PageProps } from './$types';
import { searchParamsCache } from './utils';
import { cookies } from 'next/headers';
import { client } from '@/lib/api';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { NextPage, PreviousPage } from '../api-requests/page.client';

export default async function AppEventsServerPage(props: PageProps) {
  const { apiKey, fromDate, toDate, component, functionName, level, q, page } =
    searchParamsCache.parse(props.searchParams);
  const logs = await client.GET('/projects/{id}/application-logs', {
    params: {
      path: {
        id: props.params.id,
      },
      query: {
        page: page.toString(),
        limit: '50',
        apiKey: apiKey ?? undefined,
        fromDate: fromDate ?? undefined,
        toDate: toDate ?? undefined,
        component: component ?? undefined,
        functionName: functionName ?? undefined,
        level: level ?? undefined,
        q: q ?? undefined,
      },
    },
    headers: {
      Authorization: `Bearer ${getAuthToken(await cookies())}`,
    },
  });
  if (logs.error) {
    redirect(`${Redirects.ERROR}?error=${logs.error.message}`);
  }
  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full">
        <DataTable
          columns={columns}
          data={logs.data.items}
          className="w-full"
        />
        <div className="flex flex-row gap-2">
          <PreviousPage disabled={page === 1} page={page} />
          <NextPage
            disabled={page * logs.data.itemsPerQuery >= logs.data.totalItems}
            page={page}
          />
        </div>
      </div>
    </>
  );
}
