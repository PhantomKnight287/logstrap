'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { LINKS } from './links';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { Separator } from '@/components/ui/separator';
import { Redirects } from '@/constants/redirects';

export default function NavSheet(props: { name: string; id: string }) {
  const pathname = usePathname().replace(`/dashboard/${props.id}`, '');

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:!h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <span className="sr-only">{props.name}</span>
            </Link>
            {LINKS.map((link, index) => (
              <Fragment
                key={link.type === 'separator' ? index.toString() : link.href!}
              >
                {link.type === 'separator' ? (
                  <Separator className="my-2" />
                ) : (
                  <Link
                    href={`${Redirects.AFTER_PROJECT_CREATED(props.id)}${link.href!}`}
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
                )}
              </Fragment>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
