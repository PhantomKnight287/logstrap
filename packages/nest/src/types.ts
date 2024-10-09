import { Request } from 'express';

export type LogsTrapRequest = Request & {
  'x-logstrap-id': string;
};
