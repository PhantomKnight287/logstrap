'use client';

import useFetchUser from '@/hooks/use-fetch-user';

/**
 * This component returns null and is only used to fetch data to hydrate zustand stores/other states
 * @returns null
 */
export default function Fetcher() {
  useFetchUser();
  return null;
}
