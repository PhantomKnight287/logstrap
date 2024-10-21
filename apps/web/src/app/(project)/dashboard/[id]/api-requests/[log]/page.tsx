import { getAuthToken } from '@/utils/get-cookie';
import { PageProps } from './$types';
import { cookies } from 'next/headers';
import { getCachedApiRequestLog } from './cache';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';

import { formatTime } from '../../keys/_components/timestamp';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Back from '@/components/common/back';
import LogInfoPage, { RenderBody } from './page.client';
import { components } from '@/lib/api/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RequestMethodBadge, StatusCodeBadge } from '@/components/badges';
import EncryptedCodeBlock from '../../_components/render-encrypted-codeblocks';
import { Suspense } from 'react';
import { Loader } from 'lucide-react';
import { ApiKeyInputModal } from '../../_components/api-key-input-modal';
import { generateKeyCookieName } from '@/utils/cookie';
import Code from '@/components/code';

export default async function ApiRequestLog(props: PageProps) {
  const authToken = getAuthToken(cookies());
  const data = await getCachedApiRequestLog(
    props.params.log,
    props.params.id,
    authToken,
  );
  if (data.error) {
    redirect(`${Redirects.ERROR}?error=${data.error.message}`);
  }
  const log = data.data;
  const cookieIdentifier = generateKeyCookieName(
    props.params.id,
    log.apiKeyId!,
  );
  const apiKeyCookie = cookies().get(cookieIdentifier)?.value;
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4">
      <ApiKeyInputModal
        open={!apiKeyCookie}
        projectId={props.params.id}
        authToken={authToken}
      />
      <div className="container mb-5 space-y-6">
        <Back url={`/dashboard/${log.projectId}/api-requests`} />
        <h1 className="text-2xl font-bold line-clamp-2 mt-2">
          {log.method} {log.url}
        </h1>
        <div className="mt-2 flex items-center flex-row gap-4 text-base flex-wrap justify-center md:justify-start">
          <div className="flex flex-col items-center h-full justify-between">
            <span className="text-muted-foreground">Timestamp</span>
            <Badge variant={'secondary'}>
              {formatTime(log.timestamp, 'DD/MM/YY HH:mm')}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground ">Method</span>
            <RequestMethodBadge method={log.method} />
          </div>
          {log.statusCode ? (
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">Status</span>
              <StatusCodeBadge statusCode={log.statusCode} />
            </div>
          ) : null}
          {log.ip ? (
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">IP</span>
              <Badge className="text-sm" variant={'secondary'}>
                <Suspense fallback={<Loader />}>
                  {/* @ts-expect-error Server component */}
                  <EncryptedCodeBlock
                    encryptedData={log.ip}
                    cookieIdentifier={cookieIdentifier}
                    iv={log.iv}
                    renderInCodeBlock={false}
                    defaultValue={"No IP"}
                  />
                </Suspense>
              </Badge>
            </div>
          ) : null}
          {log.userAgent ? (
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground ">User Agent</span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Badge
                    className="text-sm max-w-48 line-clamp-1"
                    variant={'secondary'}
                  >
                    {log.userAgent}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="text-black bg-card-foreground text-muted ">
                  {log.userAgent}
                </TooltipContent>
              </Tooltip>
            </div>
          ) : null}
        </div>
        <LogInfoPage
          data={log}
          ResponseBodyComponent={
            //@ts-expect-error Server component
            <EncryptedCodeBlock
              encryptedData={log.responseBody ?? ''}
              cookieIdentifier={cookieIdentifier}
              iv={log.iv}
              parseJson
              customRenderer={(data) => {
                const parsed = JSON.parse(data);
                if (!parsed || Object.keys(parsed).length === 0)
                  return <RenderBody body={{}} />;
                return <RenderBody body={parsed} />;
              }}
            />
          }
          CookiesComponent={
            //@ts-expect-error Server component
            <EncryptedCodeBlock
              encryptedData={log.cookies ?? ''}
              cookieIdentifier={cookieIdentifier}
              iv={log.iv}
              parseJson
            />
          }
          RequestHeadersComponent={
            //@ts-expect-error Server component
            <EncryptedCodeBlock
              encryptedData={log.requestHeaders ?? ''}
              cookieIdentifier={cookieIdentifier}
              iv={log.iv}
              parseJson
            />
          }
          RequestBodyComponent={
            //@ts-expect-error Server component
            <EncryptedCodeBlock
              encryptedData={log.requestBody ?? ''}
              cookieIdentifier={cookieIdentifier}
              iv={log.iv}
              parseJson
            />
          }
          ResponseHeadersComponent={
            //@ts-expect-error Server component
            <EncryptedCodeBlock
              encryptedData={log.responseHeaders ?? ''}
              cookieIdentifier={cookieIdentifier}
              iv={log.iv}
              parseJson
            />
          }
        />
        {log.applicationLogs?.length ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Logs</h2>
            <div className="flex flex-col gap-4 bg-secondary p-4 rounded-md font-mono">
              {log.applicationLogs.map((log) => (
                <LogItem
                  key={log.id}
                  log={log}
                  cookieIdentifier={cookieIdentifier}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LogItem({
  log,
  cookieIdentifier,
}: {
  log: components['schemas']['ApplicationLogEntity'];
  cookieIdentifier: string;
}) {
  return (
    <div
      className={cn('p-2 py-0 rounded-md bg-secondary', {
        'text-red-500': log.level === 'error',
        'text-blue-400': log.level === 'info',
        'text-yellow-400': log.level === 'warn',
        'text-purple-400': log.level === 'debug',
        'text-red-600 font-bold': log.level === 'fatal',
        'text-gray-400': log.level === 'trace',
      })}
    >
      {formatTime(log.timestamp, 'DD/MM/YY HH:mm')} - [{log.level}]
      {log.component || log.functionName ? (
        <>
          {' '}
          [{log.component ? `${log.component} → ` : ''}
          {log.functionName ?? ''}]
        </>
      ) : null}{' '}
      {log.message}
      <br />
      {log.additionalInfo ? (
        <>
          {/* @ts-expect-error Server component */}
          <EncryptedCodeBlock
            encryptedData={log.additionalInfo ?? ''}
            cookieIdentifier={cookieIdentifier}
            iv={log.iv}
            parseJson
            customRenderer={(data) => {
              const parsed = JSON.parse(data);
              if (!parsed || Object.keys(parsed).length === 0) return null;
              if (parsed.stack) {
                return (
                  <Code code={parsed.stack} lang="bash" theme="ayu-dark" />
                );
              }
              return <Code code={data} lang="bash" theme="ayu-dark" />;
            }}
          />
        </>
      ) : null}
    </div>
  );
}
