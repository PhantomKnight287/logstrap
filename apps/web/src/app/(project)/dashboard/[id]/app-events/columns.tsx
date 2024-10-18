'use client';

import { Redirects } from '@/constants/redirects';
import { components } from '@/lib/api/types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatTime } from '../keys/_components/timestamp';
import { LogLevelBadge } from '@/components/badges';

export const columns: ColumnDef<
  components['schemas']['FetchApplicationLogsResponseEntity']['items'][0]
>[] = [
  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ row }) => (
      <LogLevelBadge
        level={row.original.level as components['schemas']['LogLevel']}
      />
    ),
  },
  {
    accessorKey: 'message',
    header: () => <div className="text-left">Message</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`${Redirects.AFTER_PROJECT_CREATED(row.original.projectId)}/app-events/${row.original.id}`}
          className="line-clamp-1 text-left underline"
        >
          {row.original.message}
        </Link>
      );
    },
  },
  {
    accessorKey: 'component',
    header: 'Component',
    cell: ({ row }) => <div>{row.original.component}</div>,
  },
  {
    accessorKey: 'functionName',
    header: 'Function Name',
    cell: ({ row }) => <div>{row.original.functionName}</div>,
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      const formattedTime = formatTime(
        row.original.timestamp,
        'DD/MM/YYYY HH:mm:ss',
      );
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
  {
    accessorKey: 'apiKeyName',
    header: 'API Key',
    cell: ({ row }) => (
      <Link
        href={`${Redirects.AFTER_PROJECT_CREATED(row.original.projectId)}/keys/${row.original.apiKeyId}`}
        className="line-clamp-1 text-left underline"
      >
        {row.original.apiKeyName}
      </Link>
    ),
  },
];
