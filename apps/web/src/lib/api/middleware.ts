import { type Middleware } from 'openapi-fetch';
import { readCookie } from '@/utils/cookie';
import { COOKIE_NAME } from '@/constants';
import { getAuthToken } from '@/utils/get-cookie';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken =
      typeof window === 'undefined'
        ? getAuthToken((cookies() as unknown as UnsafeUnwrappedCookies))
        : readCookie(COOKIE_NAME);
    if (accessToken)
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    return request;
  },
};
