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
import { components } from '@/lib/api/types';

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

export function ApiRequestFilters({
  methods,
  statusCodes,
  apiKeys,
}: components['schemas']['ProjectApiRequestSearchFiltersResponse']) {
  const [method, setMethod] = useQueryState('method');
  const [search, setSearch] = useQueryState('search');
  const [statusCode, setStatusCode] = useQueryState('statusCode');
  const [fromDate, setFromDate] = useQueryState('fromDate');
  const [toDate, setToDate] = useQueryState('toDate');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useHotkeys('mod+f', (event) => {
    event.preventDefault();
    searchInputRef.current?.focus();
  });

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <Select
        value={method || ''}
        onValueChange={(value) => {
          setMethod(value || null);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select method" />
        </SelectTrigger>
        <SelectContent>
          {methods.map((method) => (
            <SelectItem key={method} value={method}>
              {method}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
        <Input
          ref={searchInputRef}
          className="pl-8 "
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
          {statusCodes.map((statusCode) => (
            <SelectItem key={statusCode} value={statusCode.toString()}>
              {statusCode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateRangePicker
        onUpdate={(values) => {
          console.log(values);
          setFromDate(values.range.from.toJSON());
          setToDate(values.range.to?.toJSON() || null);
        }}
        initialDateFrom={fromDate ? new Date(fromDate) : undefined}
        initialDateTo={toDate ? new Date(toDate) : undefined}
        align="start"
        locale="en-GB"
      />
    </div>
  );
}
