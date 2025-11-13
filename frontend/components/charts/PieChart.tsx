'use client';

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string[];
    }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function PieChart({ data }: PieChartProps) {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0]?.data[index] || 0,
  }));

  const colors = data.datasets[0]?.backgroundColor || COLORS;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

