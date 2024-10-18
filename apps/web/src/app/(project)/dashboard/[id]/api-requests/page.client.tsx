'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { components } from '@/lib/api/types';
import { MultiSelect } from '@/components/ui/multi-select';

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
  const [method, setMethod] = useQueryState(
    'method',
    parseAsArrayOf(parseAsString).withOptions({
      history: 'replace',
      shallow: false,
      throttleMs: 300,
    }),
  );
  const [search, setSearch] = useQueryState('q', {
    history: 'replace',
    shallow: false,
    throttleMs: 300,
  });
  const [statusCode, setStatusCode] = useQueryState(
    'statusCode',
    parseAsArrayOf(parseAsString).withOptions({
      history: 'replace',
      shallow: false,
      throttleMs: 300,
    }),
  );
  const [fromDate, setFromDate] = useQueryState('fromDate', {
    history: 'replace',
    shallow: false,
    throttleMs: 300,
  });
  const [toDate, setToDate] = useQueryState('toDate', {
    history: 'replace',
    shallow: false,
    throttleMs: 300,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApikey] = useQueryState(
    'apiKey',
    parseAsArrayOf(parseAsString).withOptions({
      history: 'replace',
      shallow: false,
      throttleMs: 300,
    }),
  );
  const { refresh } = useRouter();

  useEffect(() => {
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
    };
  }, []);

  useHotkeys('mod+f', (event) => {
    event.preventDefault();
    searchInputRef.current?.focus();
  });

  return (
    <div className="flex flex-col gap-4">
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
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <MultiSelect
          options={methods.map((method) => ({ label: method, value: method }))}
          defaultValue={method ?? []}
          onValueChange={setMethod}
          placeholder="Select method"
          className="max-w-[350px]"
        />

        <MultiSelect
          options={statusCodes.map((statusCode) => ({
            label: statusCode.toString(),
            value: statusCode.toString(),
          }))}
          defaultValue={statusCode ?? []}
          onValueChange={setStatusCode}
          placeholder="Status Code"
          className="max-w-[350px]"
          maxCount={1}
        />
        <DateRangePicker
          onUpdate={(values) => {
            setFromDate(values.range.from.toJSON());
            setToDate(values.range.to?.toJSON() || null);
          }}
          initialDateFrom={fromDate ? new Date(fromDate) : undefined}
          initialDateTo={toDate ? new Date(toDate) : undefined}
          align="start"
          locale="en-GB"
        />
        <MultiSelect
          options={apiKeys.map((key) => ({ label: key.name, value: key.id }))}
          defaultValue={apiKey ?? []}
          onValueChange={setApikey}
          placeholder="API Key"
          className="max-w-[350px]"
          maxCount={1}
        />
      </div>
    </div>
  );
}
