import { Request } from 'express';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';

export type ExtendedRequest = Request & {
  [LOGSTRAP_REQUEST_ID]: string;
};
