import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import SidebarNav from './_components/sidebar';
import NavSheet from './_components/sheet';

export default function DashboardLayout(
  props: PropsWithChildren & { params: Record<string, string> },
) {
  console.log(props.params);
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
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
                <span className="">Voice Learn</span>
              </Link>
            </div>
            <SidebarNav id={props.params.id!} />
          </div>
        </div>
        <div className="flex flex-col">
          <NavSheet name={'Voice Learn'} id={props.params.id!} />
          {props.children}
        </div>
      </div>
    </>
  );
}
