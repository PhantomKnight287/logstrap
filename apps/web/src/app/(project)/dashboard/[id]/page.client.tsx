'use client';

import { components } from '@/lib/api/types';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const formatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const apiRequestsPerDayConfig = {
  date: {
    label: 'Date',
    color: '#2563eb',
  },
  url: {
    label: 'URL',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

export default function ProjectStats({
  apiRequestsPerDay,
}: components['schemas']['ProjectStatsResponseEntity']) {
  console.log(apiRequestsPerDay);
  return (
    <>
      <ChartContainer
        config={apiRequestsPerDayConfig}
        className="min-h-[500px] w-full"
      >
        <BarChart accessibilityLayer data={apiRequestsPerDay}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => formatter.format(new Date(value))}
          />
          <CartesianGrid vertical={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="count" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="date" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  );
}
