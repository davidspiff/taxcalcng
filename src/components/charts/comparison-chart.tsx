'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ComparisonData {
  name: string;
  old: number;
  new: number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
}

export function ComparisonChart({ data, height = 300 }: ComparisonChartProps & { height?: number | string }) {
  const formatValue = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  return (
    // @ts-expect-error - Recharts types are strict about string percentages
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 5, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis 
          tickFormatter={(v) => v >= 1000000 ? `₦${(v / 1000000).toFixed(1)}M` : `₦${(v / 1000).toFixed(0)}k`} 
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip 
          formatter={(value: number) => formatValue(value)} 
          cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <Bar dataKey="old" name="Old Law" fill="#64748B" radius={[4, 4, 0, 0]} />
        <Bar dataKey="new" name="2026" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
