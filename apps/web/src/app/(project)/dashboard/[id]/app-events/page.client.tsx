'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { components } from '@/lib/api/types';
import { upperFirst } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export function AppEventsFilters({
  components,
  functionNames,
  logLevels,
}: components['schemas']['ProjectApplicationLogsSearchFiltersResponse']) {
  const [level, setLevel] = useQueryState(
    'level',
    parseAsArrayOf(parseAsString).withOptions({
      history: 'replace',
      shallow: false,
      throttleMs: 300,
    }),
  );

  const [component, setComponent] = useQueryState(
    'component',
    parseAsArrayOf(parseAsString).withOptions({
      history: 'replace',
      shallow: false,
      throttleMs: 300,
    }),
  );

  const [functionName, setFunctionName] = useQueryState(
    'functionName',
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

  const [search, setSearch] = useQueryState('q', {
    history: 'replace',
    shallow: false,
    throttleMs: 300,
  });
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
          options={logLevels.map((level) => ({
            label: upperFirst(level),
            value: level,
          }))}
          defaultValue={level ?? []}
          onValueChange={setLevel}
          placeholder="Select Log Level"
          className="max-w-[350px]"
        />

        <MultiSelect
          options={components.map((component) => ({
            label: component,
            value: component,
          }))}
          defaultValue={component ?? []}
          onValueChange={setComponent}
          placeholder="Component"
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
          options={functionNames.map((functionName) => ({
            label: functionName,
            value: functionName,
          }))}
          defaultValue={functionName ?? []}
          onValueChange={setFunctionName}
          placeholder="Function Name"
          className="max-w-[350px]"
          maxCount={1}
        />
      </div>
    </div>
  );
}
