'use server';

import { revalidateTag } from 'next/cache';

export async function purgeCache(tag: string) {
  revalidateTag(tag);
  return true;
}
