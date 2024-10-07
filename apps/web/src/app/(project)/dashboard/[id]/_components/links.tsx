import { ChartBar, CircleAlert, Code2, Home, Settings2 } from 'lucide-react';
export const LINKS = [
  {
    href: '',
    icon: <Home className="h-4 w-4" />,
    label: 'Home',
  },
  {
    href: `/app-events`,
    label: 'App Events',
    icon: <CircleAlert className="h-4 w-4" />,
  },
  {
    href: `/api-requests`,
    label: 'API Requests',
    icon: <ChartBar className="h-4 w-4" />,
  },
  {
    type: 'separator',
  },
  {
    href: `/keys`,
    label: 'API Keys',
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    href: `/settings`,
    label: 'Settings',
    icon: <Settings2 className="h-4 w-4" />,
  },
];
