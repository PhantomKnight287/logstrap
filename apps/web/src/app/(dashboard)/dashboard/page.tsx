import { buttonVariants } from '@/components/ui/button';
import { Redirects } from '@/constants/redirects';
import { client } from '@/lib/api';
import { getAuthToken } from '@/utils/get-cookie';
import { Plus } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProjectItem from './_components/item';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function Dashboard(
  props: {
    searchParams: Promise<Record<string, string>>;
  }
) {
  const searchParams = await props.searchParams;
  const token = getAuthToken(await cookies());
  const req = await client.GET('/projects', {
    params: { query: { page: searchParams.page || '1' } },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (req.error) {
    redirect(`${Redirects.ERROR}?error=${req?.error?.message}`);
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container py-6 space-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-3xl font-medium">Your Projects</span>
          <Link
            href="/dashboard/new"
            className={buttonVariants({
              variant: 'default',
              className: 'flex flex-row items-center gap-2',
            })}
          >
            <Plus />
            Create a new project
          </Link>
        </div>
        {req.data.totalItems == 0 ? (
          <p className="text-center">No projects found. Create one</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {req.data.items.map((item) => (
              <ProjectItem {...item} key={item.id} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Manage your projects',
};
