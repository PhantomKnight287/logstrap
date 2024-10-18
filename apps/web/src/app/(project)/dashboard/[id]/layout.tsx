import { PropsWithChildren, Suspense } from 'react';
import DynamicLayout from './layout.client';
import LoadingIndicator from './loading';

export default function DashboardLayout(
  props: PropsWithChildren & { params: Record<string, string> },
) {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<LoadingIndicator />}>
          <DynamicLayout id={props.params.id!}>{props.children}</DynamicLayout>
        </Suspense>
      </div>
    </>
  );
}
