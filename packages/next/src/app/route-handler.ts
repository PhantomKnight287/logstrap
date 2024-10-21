import {
  LOGSTRAP_API_KEY,
  LOGSTRAP_REQUEST_EXTENSION,
} from '@logstrap/constants';
import {
  createEndpointUrl,
  logApiRequest,
  LogsTrapInitOptions,
} from '@logstrap/core';
import { asyncLocalStorageWrapped, getLogsStorage } from 'src/utils';

/**
 * Creates factory function to wrap route handlers with AsyncLocalStorage context
 * @param options - The options for the logger
 * @returns - The route handler with logger
 */
export function createRouteHandlerWithLogger(options: LogsTrapInitOptions) {
  options;
  return function (route: Function) {
    return asyncLocalStorageWrapped(withLogger(route, options));
  };
}

function withLogger(route: Function, options: LogsTrapInitOptions) {
  options;
  return async (req: Request) => {
    const clonedRequest = req.clone();
    const response: Response = await route(req);
    // Clone the response to avoid consuming the body
    const clonedResponse = response.clone();

    // Start the logging process asynchronously
    const loggingPromise = (async () => {
      try {
        let responseBody = {};
        let result = undefined;
        const requestContentType = clonedRequest.headers
          .get('content-type')
          ?.split(';')[0];
        let requestBody = undefined;
        if (requestContentType === 'application/json') {
          requestBody = await clonedRequest.json();
        } else {
          requestBody = await clonedRequest.text();
        }
        if (clonedResponse.body && !clonedResponse.bodyUsed) {
          const reader = clonedResponse.body.getReader();
          const decoder = new TextDecoder();
          result = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
          }
        }
        const allLogs = getLogsStorage();
        const endpointUrl = await createEndpointUrl(options);
        // strip charset
        const contentType = clonedResponse.headers
          .get('content-type')
          ?.split(';')[0];
        const isValidResponse = Object.keys({
          ...LOGSTRAP_REQUEST_EXTENSION,
          'application/json': '',
        }).includes(contentType ?? '');

        if (isValidResponse) {
          if (contentType === 'application/json') {
            responseBody = JSON.parse(result ?? '{}');
          } else {
            responseBody = {
              [LOGSTRAP_REQUEST_EXTENSION[
                contentType as keyof typeof LOGSTRAP_REQUEST_EXTENSION
              ]]: result,
            };
          }
        }
        //@ts-expect-error
        const responseHeaders = new Headers(clonedResponse.headers).entries();
        const headers: Record<string, any> = {};
        for (const [key, value] of responseHeaders) {
          headers[key] = value;
        }
        const req = await logApiRequest(
          endpointUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              [LOGSTRAP_API_KEY]: options.apiKey,
            },
          },
          {
            requests: [
              {
                ...allLogs,
                //@ts-expect-error
                responseHeaders: headers,
                statusCode: clonedResponse.status,
                responseBody: responseBody,
                requestBody: requestBody,
              },
            ],
          },
        );
        if (!req.ok) {
          console.log(await req.json());
        }
      } catch (e) {
        console.error(e);
      }
    })();

    // Don't await the logging promise, let it run in the background
    loggingPromise.catch(console.error); // Handle any errors in the background

    return response;
  };
}
