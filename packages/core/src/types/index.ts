export interface LogsTrapInitOptions {
  /**
   * Your Api Key, starts with `key_`
   */
  apiKey: string;
  /**
   * Your project id, starts with `pj_`
   */
  projectId: string;
  /**
   * The endpoint where logstrap instance is running
   * @default https://logstrap-api.procrastinator.fyi
   */
  endpoint?: string;
}

