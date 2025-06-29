import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, startOfDay } from 'date-fns';
import { OverviewMetricsDataItem } from '@/services/mqtt';

interface SimpleLineChartProps {
  title?: string;
  data?: OverviewMetricsDataItem[];
}

// 生成默认数据：从今天开始向前七天
function generateDefaultData(): OverviewMetricsDataItem[] {
  const data: OverviewMetricsDataItem[] = [];
  const today = startOfDay(new Date());

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: date.getTime(),
      count: 0,
    });
  }

  return data;
}

// 格式化日期显示
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return format(date, 'MM-dd');
}

export function SimpleLineChart({ title = '', data }: SimpleLineChartProps) {
  const chartData = !data || data.length === 0 ? generateDefaultData() : data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDate}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `${value}`}
              width={20}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
              labelFormatter={formatDate}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              connectNulls={true}
              isAnimationActive={true}
              animationDuration={1000}
              dot={{
                fill: 'var(--primary)',
                stroke: '#fff',
                strokeWidth: 2,
                r: 4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
