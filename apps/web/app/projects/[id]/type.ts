export type Log = {
  id: string;
  statusCode?: number;
  message?: string;
  path?: string;
  requestHeaders?: object;
  requestBody?: string;
  responseHeaders?: string;
  responseBody?: string;
  stackTrace?: string;
  method: string;
  createdAt: string;
  updatedAt: string;

  projectId: string;
};
