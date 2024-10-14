import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from 'nuqs/server';
export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(''),
  method: parseAsArrayOf(parseAsString),
  statusCode: parseAsArrayOf(parseAsString),
  fromDate: parseAsString,
  toDate: parseAsString,
  apiKey: parseAsArrayOf(parseAsString),
  page: parseAsInteger.withDefault(1),
});
