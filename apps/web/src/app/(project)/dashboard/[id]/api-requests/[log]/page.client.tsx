'use client';

import Code from '@/components/code';
import { components } from '@/lib/api/types';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
export default function LogInfoPage({
  data,
}: {
  data: components['schemas']['LogEntity'];
}) {
  return (
    <div className="flex flex-col items-start mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-0 md:gap-5 w-full">
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Request Body</h3>
          <Suspense fallback={<Loader />}>
            <Code
              lang="json"
              code={
                data.requestBody !== undefined && data.requestBody !== null
                  ? JSON.stringify(data.requestBody, null, '\t')
                  : JSON.stringify({})
              }
              theme="ayu-dark"
            />
          </Suspense>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Request Headers</h3>
          <Suspense fallback={<Loader />}>
            <Code
              lang="json"
              code={
                data.requestHeaders !== undefined &&
                data.requestHeaders !== null
                  ? JSON.stringify(data.requestHeaders, null, '\t')
                  : JSON.stringify({})
              }
              theme="ayu-dark"
            />
          </Suspense>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Response Body</h3>
          <Suspense fallback={<Loader />}>
            <Code
              lang="json"
              code={
                data.responseBody !== undefined && data.responseBody !== null
                  ? JSON.stringify(data.responseBody, null, '\t')
                  : JSON.stringify({})
              }
              theme="ayu-dark"
            />
          </Suspense>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Response Headers</h3>
          <Suspense fallback={<Loader />}>
            <Code
              lang="json"
              code={
                data.responseHeaders !== undefined &&
                data.responseHeaders !== null
                  ? JSON.stringify(data.responseHeaders, null, '\t')
                  : JSON.stringify({})
              }
              theme={'ayu-dark'}
            />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-lg font-medium">Cookies</h3>
        <Suspense fallback={<Loader />}>
          <Code
            lang="json"
            code={
              data.responseHeaders !== undefined &&
              data.responseHeaders !== null
                ? JSON.stringify(data.cookies, null, '\t')
                : JSON.stringify({})
            }
            theme={'ayu-dark'}
          />
        </Suspense>
      </div>
      {/* {data.stackTrace ? (
        <div className="w-full flex flex-col items-start mt-4">
          <h3 className="text-lg font-medium">Stack Trace</h3>
          <Code lang="bash" code={data.stackTrace} theme="ayu-dark" />
        </div>
      ) : null} */}
    </div>
  );
}

export function Timestamp({ t }: { t: string }) {
  return <span className="text-sm">{dayjs(t).format('DD/MM/YY HH:mm')}</span>;
}

function Loader() {
  return (
    <div className="w-full h-20 bg-muted flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
