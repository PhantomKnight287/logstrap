'use client';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';

export default function Back({ url }: { url: string }) {
  const router = useRouter();

  function handleBack() {
    // TODO: Replace with a more robust solution.
    // @ts-expect-error Not implemented in all browsers.
    if (window.navigation?.canGoBack) {
      router.back();
    } else {
      router.replace(url);
    }
  }

  useHotkeys('escape', handleBack);
  return (
    <Button
      className="flex flex-row items-center gap-2 dark:text-white text-black"
      variant={'secondary'}
      onClick={handleBack}
    >
      <ChevronLeft />
      Back
    </Button>
  );
}
