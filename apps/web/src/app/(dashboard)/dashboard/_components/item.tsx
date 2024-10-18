import { Card, CardTitle } from '@/components/ui/card';
import { components } from '@/lib/api/types';
import Link from 'next/link';

export default function ProjectItem(props: components['schemas']['Project']) {
  return (
    <Link href={`/dashboard/${props.id}`}>
      <Card>
        <CardTitle>
          <div className="h-[150px] jigsaw-pattern rounded-t-xl" />

          <div className="flex flex-col items-start justify-start gap-2 p-4">
            <p className="pointer-events-none block truncate text-xl font-medium">
              {props.name}
            </p>
            <span className="text-sm font-normal">
              {props.url ?? 'No url specified'}
            </span>
          </div>
        </CardTitle>
      </Card>
    </Link>
  );
}
