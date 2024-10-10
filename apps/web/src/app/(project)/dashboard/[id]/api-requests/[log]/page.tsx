import { getAuthToken } from '@/utils/get-cookie';
import { PageProps } from './$types';
import { cookies } from 'next/headers';
import { getCachedApiRequestLog } from './cache';
import { redirect } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import {
  Clock,
  Globe,
  Hash,
  ArrowRight,
  ArrowLeft,
  Cookie,
  FileText,
} from 'lucide-react';

export default async function ApiRequestLog(props: PageProps) {
  const data = await getCachedApiRequestLog(
    props.params.log,
    props.params.id,
    getAuthToken(cookies()),
  );
  if (data.error) {
    redirect(`${Redirects.ERROR}?error=${data.error.message}`);
  }
  const log = data.data;
  return (
    <div className="shadow-lg rounded-lg p-6 ">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        API Request Log Details
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Globe className="mr-2 text-blue-500" />
          <span className="font-semibold">Method: </span> {log.method}
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 text-green-500" />
          <span className="font-semibold">Time Taken: </span> {log.timeTaken}ms
        </div>
        <div className="col-span-2 flex items-center">
          <Globe className="mr-2 text-blue-500" />
          <span className="font-semibold">URL: </span> {log.url}
        </div>
        <div className="flex items-center">
          <Hash className="mr-2 text-purple-500" />
          <span className="font-semibold">Status Code: </span> {log.statusCode}
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 text-yellow-500" />
          <span className="font-semibold">Timestamp: </span> {log.timestamp}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <ArrowRight className="mr-2 text-blue-500" /> Request
          </h2>
          <div className="p-4 rounded">
            <h3 className="font-semibold mb-2">Headers:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(log.requestHeaders, null, 2)}
            </pre>
            <h3 className="font-semibold mt-4 mb-2">Body:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(log.requestBody, null, 2)}
            </pre>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <ArrowLeft className="mr-2 text-green-500" /> Response
          </h2>
          <div className="p-4 rounded">
            <h3 className="font-semibold mb-2">Headers:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(log.responseHeaders, null, 2)}
            </pre>
            <h3 className="font-semibold mt-4 mb-2">Body:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(log.responseBody, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Cookie className="mr-2 text-yellow-500" /> Cookies
        </h2>
        <div className="p-4 rounded">
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(log.cookies, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <FileText className="mr-2 text-purple-500" /> Application Logs
        </h2>
        {/* <div className="bg-gray-100 p-4 rounded">
          <ul className="list-disc list-inside">
            {log.applicationLogs.map((logEntry, index) => (
              <li key={index} className="text-sm">
                {logEntry}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </div>
  );
}
