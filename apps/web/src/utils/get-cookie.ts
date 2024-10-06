import { COOKIE_NAME } from '@/constants';
import { Redirects } from '@/constants/redirects';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export function getAuthToken(cookieStore: ReturnType<typeof cookies>) {
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    // we can call redirect here as this function will only run on server
    redirect(Redirects.UNAUTHENTICATED);
  }
  return token;
}
