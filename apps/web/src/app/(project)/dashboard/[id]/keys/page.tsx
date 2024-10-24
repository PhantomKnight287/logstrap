import { getAuthToken } from '@/utils/get-cookie';
import { getCachedApiKeys } from './cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';

import { CreateNewApiKeyButton } from './page.client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export const dynamic = 'force-dynamic';

export default async function ApiKeys(
  props: {
    params: Promise<{ [key: string]: string }>;
  }
) {
  const params = await props.params;
  const keys = await getCachedApiKeys(params.id!, getAuthToken(await cookies()));
  if (keys.error) redirect(`${Redirects.ERROR}?error=${keys.error.message}`);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-lg font-semibold md:text-2xl w-fit">
            API Keys ({keys.data.totalItems})
          </h1>
          <p className="text-sm text-muted-foreground">
            Project ID: {params.id}
          </p>
        </div>
        <CreateNewApiKeyButton />
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center size-full p-2">
          <DataTable
            columns={columns}
            data={keys.data.items}
            className="w-full"
          />
        </div>
      </div>
    </main>
  );
}
