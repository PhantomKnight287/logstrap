'use client';

import { components } from '@/lib/api/types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatTime } from './_components/timestamp';

export const columns: ColumnDef<
  components['schemas']['FetchAllKeysResponse']['items'][0]
>[] = [
  {
    accessorKey: 'mode',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/${row.original.projectId}/keys/${row.original.id}`}
          className="underline text-left"
        >
          {row.original.id}
        </Link>
      );
    },
  },
  {
    accessorKey: 'description',
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => {
      return (
        <span className="line-clamp-1 text-left">
          {row.original.description ?? '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-left">Created At</div>,
    cell: ({ row }) => {
      const formattedTime = formatTime(row.original.createdAt);
      const validElementTime = formatTime(
        row.original.createdAt,
        'YYYY-MM-DD HH:mm:ss',
      );
      return (
        <div className="text-left font-medium">
          <time dateTime={validElementTime}>{formattedTime}</time>
        </div>
      );
    },
  },
];
