import { getAuthToken } from '@/utils/get-cookie';
import { cookies } from 'next/headers';
import { getCachedProjectDetails } from './cache';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SidebarNav from './_components/sidebar';
import NavSheet from './_components/sheet';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';

export default async function DynamicLayout({
  id,
  children,
}: PropsWithChildren & { id: string }) {
  const token = getAuthToken(cookies());
  const project = await getCachedProjectDetails(id, token);
  if (project.error) {
    redirect(`${Redirects.ERROR}?error=${project.error.message}`);
  }
  return (
    <>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-2">
            <Link href="/dashboard">
              <ArrowLeft />
            </Link>
            <Link
              href={`/dashboard`}
              className="flex items-center gap-2 font-semibold"
            >
              <span className="">{project.data.name}</span>
            </Link>
          </div>
          <SidebarNav id={id!} />
        </div>
      </div>
      <div className="flex flex-col">
        <NavSheet name={project.data.name} id={id!} />
        {children}
      </div>
    </>
  );
}
