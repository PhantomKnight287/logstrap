"use client";

import Code from "@/components/code";
import { Log } from "../type";
export default function LogInfoPage({ data }: { data: Log }) {
  return (
    <div className="flex flex-col items-center mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-0 md:gap-5 w-full">
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Request Body</h3>
          <Code
            lang="json"
            code={
              data.requestBody !== undefined && data.requestBody !== null
                ? JSON.stringify(JSON.parse(data.requestBody), null, "\t")
                : JSON.stringify({})
            }
            theme="ayu-dark"
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Request Headers</h3>
          <Code
            lang="json"
            code={
              data.requestHeaders !== undefined && data.requestHeaders !== null
                ? JSON.stringify(data.requestHeaders, null, "\t")
                : JSON.stringify({})
            }
            theme="ayu-dark"
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Response Body</h3>
          <Code
            lang="json"
            code={
              data.responseBody !== undefined && data.responseBody !== null
                ? JSON.stringify(JSON.parse(data.responseBody), null, "\t")
                : JSON.stringify({})
            }
            theme="ayu-dark"
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-medium">Response Headers</h3>
          <Code
            lang="json"
            code={
              data.responseHeaders !== undefined &&
              data.responseHeaders !== null
                ? JSON.stringify(data.responseHeaders, null, "\t")
                : JSON.stringify({})
            }
            theme="ayu-dark"
          />
        </div>
      </div>
      {data.stackTrace ? (
        <div className="w-full flex flex-col items-start mt-4">
          <h3 className="text-lg font-medium">Stack Trace</h3>
          <Code lang="bash" code={data.stackTrace} theme="ayu-dark" />
        </div>
      ) : null}
    </div>
  );
}
