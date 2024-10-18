import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString,
  fromDate: parseAsString,
  toDate: parseAsString,
  level: parseAsArrayOf(parseAsString),
  component: parseAsArrayOf(parseAsString),
  functionName: parseAsArrayOf(parseAsString),
  apiKey: parseAsArrayOf(parseAsString),
  page: parseAsInteger.withDefault(1),
});
