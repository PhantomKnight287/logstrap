'use client';

import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CreateNewApiKeyButton() {
  const pathname = usePathname();

  return (
    <Link
      className={buttonVariants({
        variant: 'default',
        className: 'flex flex-row items-center justify-center gap-2 ml-auto',
      })}
      href={`${pathname}/new`}
    >
      <Plus />
      Create New API Key
    </Link>
  );
}
