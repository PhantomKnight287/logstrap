import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StatusCodeBadge({ statusCode }: { statusCode: number }) {
  return (
    <Badge
      className={cn('text-white', {
        'bg-blue-500': statusCode >= 100 && statusCode < 200,
        'bg-green-500': statusCode >= 200 && statusCode < 300,
        'bg-red-500': statusCode >= 500,
        'bg-purple-500': statusCode >= 300 && statusCode < 300,
        'bg-yellow-500': statusCode >= 400 && statusCode < 500,
      })}
      variant="outline"
    >
      {statusCode}
    </Badge>
  );
}

export function RequestMethodBadge({ method }: { method: string }) {
  return (
    <Badge
      className={cn('text-white', {
        'bg-blue-500': method === 'GET',
        'bg-green-500': method === 'POST',
        'bg-yellow-500': method === 'PATCH',
        'bg-red-500': method === 'DELETE',
        'bg-gray-500': method === 'OPTIONS',
        'bg-purple-500': method === 'PUT',
      })}
      variant="outline"
    >
      {method}
    </Badge>
  );
}
