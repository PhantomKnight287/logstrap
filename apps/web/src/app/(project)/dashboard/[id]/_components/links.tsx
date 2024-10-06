import { Redirects } from '@/constants/redirects';
import { CircleAlert, Home, User } from 'lucide-react';
export const LINKS = (id: string) => [
  {
    href: Redirects.AFTER_PROJECT_CREATED(id),
    icon: <Home className="h-4 w-4" />,
    label: 'Home',
  },
  {
    href: `${Redirects.AFTER_PROJECT_CREATED(id)}/app-events`,
    label: 'App Events',
    icon: <User className="h-4 w-4" />,
  },
  {
    href: `${Redirects.AFTER_PROJECT_CREATED(id)}/api-requests`,
    label: 'API Requests',
    icon: <CircleAlert className="h-4 w-4" />,
  },
];
