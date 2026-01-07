'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface WaterfallItem {
  name: string;
  value: number;
  type: 'income' | 'deduction' | 'tax' | 'net';
}

interface WaterfallChartProps {
  data: WaterfallItem[];
}

export function WaterfallChart({ data }: WaterfallChartProps) {
  const colors = {
    income: '#1E3A5F',
    deduction: '#F59E0B',
    tax: '#EF4444',
    net: '#2ECC71',
  };

  const formatValue = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  const chartData = data.reduce<
    Array<WaterfallItem & { start: number; end: number; fill: string }>
  >((acc, item) => {
    const previousEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;

    const end =
      item.type === 'income' || item.type === 'net'
        ? item.value
        : previousEnd - item.value;

    acc.push({
      ...item,
      start: previousEnd,
      end,
      fill: colors[item.type],
    });

    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
        <Tooltip
          formatter={(value: number) => formatValue(value)}
          labelFormatter={(label) => label}
        />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
