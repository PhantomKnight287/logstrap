/**
 * Where to redirect users after an action, this is to prevent magic strings in codebase
 */
export const Redirects = {
  AFTER_AUTH: '/dashboard',
  UNAUTHENTICATED: '/auth/login',
  ERROR: '/error',
  AFTER_PROJECT_CREATED(id: string) {
    return `${this.AFTER_AUTH}/${id}`;
  },
};
