import { COOKIE_NAME } from '@/constants';
import { client } from '@/lib/api';
import { useUser } from '@/state/user';
import { eraseCookie, readCookie } from '@/utils/cookie';
import { useEffect } from 'react';
import useLoading from './use-loading';

export default function useFetchUser() {
  const { user, setUser } = useUser();
  const { loading, toggle } = useLoading();
  async function fetchUser() {
    toggle();
    const cookie = readCookie(COOKIE_NAME);
    if (!cookie) return;
    const req = await client.GET('/auth/@me', {
      headers: { Authorization: `Bearer ${cookie}` },
    });
    if (req.error) {
      toggle();
      if (process.env.NODE_ENV === 'development') {
        throw new Error(req.error.message);
      }
      eraseCookie(COOKIE_NAME);
    }
    setUser(req.data);
    toggle();
  }
  useEffect(() => {
    if (!user?.id) fetchUser();
  }, []);

  return { user, loading };
}
