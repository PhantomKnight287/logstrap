'use client';

import Code from '@/components/code';
import { components } from '@/lib/api/types';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { LOGSTRAP_REQUEST_EXTENSION } from '@logstrap/constants';
import { BundledLanguage } from 'shiki';

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
            {data.responseBody !== undefined && data.responseBody !== null ? (
              <RenderBody body={data.responseBody} />
            ) : null}
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
      </div>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderBody({ body }: { body: Record<string, any> }) {
  const keys = Object.values(LOGSTRAP_REQUEST_EXTENSION);
  let validKey = undefined;
  for (const key of keys) {
    if (body[key]) {
      validKey = key;
      break;
    }
  }
  if (!validKey)
    return (
      <Code
        lang="json"
        code={JSON.stringify(body, null, '\t')}
        theme="ayu-dark"
      />
    );
  const elements = validKey.split('-');
  const language = elements[elements.length - 1];

  return (
    <Code
      lang={language === 'text' ? 'bash' : (language as BundledLanguage)}
      code={JSON.stringify(body[validKey], null, '\t')}
      theme="ayu-dark"
    />
  );
}
