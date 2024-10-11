'use client';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';

export default function Back({
  url,
  backOnEscape = false,
}: {
  url: string;
  backOnEscape?: boolean;
}) {
  const router = useRouter();
  useHotkeys('escape', () => {
    if (backOnEscape) {
      router.push(url);
    }
  });

  return (
    <Link
      href={url}
      className={buttonVariants({
        variant: 'secondary',
        className: 'flex flex-row items-center gap-2 dark:text-white text-black',
      })}
    >
      <ChevronLeft />
      Back
    </Link>
  );
}
