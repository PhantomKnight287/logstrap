import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@logstrap/core';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { logger } from './logger';

export type NextMiddleware = (
  request: NextRequest,
) => Promise<NextResponse | Response> | NextResponse | Response;

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export function withTracing(): MiddlewareFactory {
  return (middleware: NextMiddleware): NextMiddleware => {
    return async (request: NextRequest) => {
      const requestId = generateId();
      console.log(requestId)
      await logger.addRequestToStorage(requestId, {
        method: request.method,
        statusCode: -1,
        url: request.nextUrl.toString(),
        applicationLogs: [],
        cookies: JSON.parse(JSON.stringify(request.cookies.getAll())),
        ip: request.ip,
        userAgent: request.headers.get('user-agent') ?? undefined,
      });
      try {
        // Execute the passed middleware
        const result = await middleware(request);

        // Ensure we have a NextResponse object
        const nextResponse =
          result instanceof NextResponse ? result : NextResponse.next();

        // Add tracing headers
        nextResponse.headers.set(LOGSTRAP_REQUEST_ID, requestId);
        return nextResponse;
      } catch (error) {
        throw error; // Re-throw to be handled by Next.js error boundary
      }
    };
  };
}
