import dayjs from 'dayjs';
export function Timestamp({ t }: { t: string }) {
  return <span className="text-sm">{dayjs(t).format('DD/MM/YY HH:mm')}</span>;
}

export function formatTime(t: string, format?: string) {
  return dayjs(t).format(format ?? 'DD/MM/YY HH:mm');
}
