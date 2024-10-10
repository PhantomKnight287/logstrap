import { client } from '@/lib/api';
import { PageProps } from './$types';
import {} from '@logstrap/constants';
import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { NextPage, PreviousPage } from './page.client';

export const dynamic = 'force-dynamic';

export default async function ApiRequests({ params, searchParams }: PageProps) {
  let page: number | string = searchParams.page as string;
  page = Number.isNaN(+page) ? 1 : Number(page);
  const logs = await client.GET('/projects/{id}/request-logs', {
    params: {
      path: {
        id: params.id,
      },
      query: {
        page: page.toString(),
        limit: '50',
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
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center flex-row justify-between">
        <h1 className="text-lg font-semibold md:text-2xl w-fit">
          API Requests
        </h1>
        <div className="flex flex-row gap-2">
          <PreviousPage disabled={page === 1} page={page} />
          <NextPage
            disabled={page * logs.data.itemsPerQuery >= logs.data.totalItems}
            page={page}
          />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center size-full p-2">
          <DataTable
            columns={columns}
            data={logs.data.items}
            className="w-full"
          />
        </div>
      </div>
    </main>
  );
}
