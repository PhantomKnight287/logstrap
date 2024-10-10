'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
export function NextPage({
  disabled,
  page,
}: {
  disabled: boolean;
  page: number;
}) {
  console.log({ disabled, page });
  const { replace } = useRouter();
  const pathname = usePathname();
  function moveToNextPage() {
    if (disabled) return;
    const query = new URLSearchParams(window.location.search);
    query.set('page', (page + 1).toString());
    replace(`${pathname}?${query.toString()}`);
  }
  useHotkeys('right', () => {
    moveToNextPage();
  });
  return (
    <Button disabled={disabled} variant={'secondary'} onClick={moveToNextPage}>
      <ChevronRight />
    </Button>
  );
}

export function PreviousPage({
  disabled,
  page,
}: {
  disabled: boolean;
  page: number;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  function moveToPreviousPage() {
    if (disabled) return;
    const query = new URLSearchParams(window.location.search);
    query.set('page', (page - 1).toString());
    replace(`${pathname}?${query.toString()}`);
  }
  useHotkeys('left', () => {
    moveToPreviousPage();
  });
  return (
    <Button
      disabled={disabled}
      variant={'secondary'}
      onClick={moveToPreviousPage}
    >
      <ChevronLeft />
    </Button>
  );
}
