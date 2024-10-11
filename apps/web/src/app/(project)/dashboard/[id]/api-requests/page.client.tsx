'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export function NextPage({
  disabled,
  page,
}: {
  disabled: boolean;
  page: number;
}) {
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

export function ApiRequestFilters() {
  const [method, setMethod] = useQueryState('method');
  const [search, setSearch] = useQueryState('search');
  const [statusCode, setStatusCode] = useQueryState('statusCode');
  const [date, setDate] = useQueryState('date');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useHotkeys('mod+f', (event) => {
    event.preventDefault();
    searchInputRef.current?.focus();
  });

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <Select
        value={method || ''}
        onValueChange={(value) => setMethod(value || null)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GET">GET</SelectItem>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="PUT">PUT</SelectItem>
          <SelectItem value="DELETE">DELETE</SelectItem>
          <SelectItem value="PATCH">PATCH</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          ref={searchInputRef}
          className="pl-8"
          placeholder="Search... (Ctrl+F)"
          value={search || ''}
          onChange={(e) => setSearch(e.target.value || null)}
        />
      </div>

      <Select
        value={statusCode || ''}
        onValueChange={(value) => setStatusCode(value || null)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status code" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="200">200 OK</SelectItem>
          <SelectItem value="201">201 Created</SelectItem>
          <SelectItem value="400">400 Bad Request</SelectItem>
          <SelectItem value="401">401 Unauthorized</SelectItem>
          <SelectItem value="404">404 Not Found</SelectItem>
          <SelectItem value="500">500 Internal Server Error</SelectItem>
        </SelectContent>
      </Select>

      <DateRangePicker
        onUpdate={(values) => console.log(values)}
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        align="start"
        locale="en-GB"
        showCompare={false}
      />
    </div>
  );
}
