'use client';

import Link from 'next/link';
import { LINKS } from './links';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SidebarNav(props: { id: string }) {
  const pathname = usePathname();

  return (
    <div className="flex-1">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {LINKS(props.id).map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
              {
                'text-primary bg-muted': pathname === link.href,
                'text-muted-foreground': pathname !== link.href,
              },
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
