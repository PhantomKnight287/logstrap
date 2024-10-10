import { getAuthToken } from '@/utils/get-cookie';
import { getCachedProjectDetails } from './cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';


export const dynamic = 'force-dynamic';
export default async function ProjectInfo({
  params,
}: {
  params: Record<string, string>;
}) {
  
  const project = await getCachedProjectDetails(
    params.id!,
    getAuthToken(cookies()),
  );


  if (project.error)
    redirect(`${Redirects.ERROR}?error=${project.error.message}`);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center"></div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            {project.data.name}
          </h3>
        </div>
      </div>
    </main>
  );
}
