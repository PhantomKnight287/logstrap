'use client';

import { Redirects } from '@/constants/redirects';
import { components } from '@/lib/api/types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatTime } from '../keys/_components/timestamp';
import { RequestMethodBadge, StatusCodeBadge } from '@/components/badges';

export const columns: ColumnDef<
  components['schemas']['FetchRequestLogsResponseEntity']['items'][0]
>[] = [
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => <RequestMethodBadge method={row.original.method} />,
  },
  {
    accessorKey: 'url',
    header: () => <div className="text-left">Url</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`${Redirects.AFTER_PROJECT_CREATED(row.original.projectId)}/api-requests/${row.original.id}`}
          className="line-clamp-1 text-left underline"
        >
          {row.original.url}
        </Link>
      );
    },
  },
  {
    accessorKey: 'statusCode',
    header: 'Status Code',
    cell: ({ row }) => <StatusCodeBadge statusCode={row.original.statusCode} />,
  },
  {
    accessorKey: 'timeTaken',
    header: 'Time Taken',
    cell: ({ row }) => (
      <>
        {row.original.timeTaken ? (
          <span>{row.original.timeTaken} ms</span>
        ) : null}
      </>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      const formattedTime = formatTime(row.original.timestamp);
      const validElementTime = formatTime(
        row.original.timestamp,
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
