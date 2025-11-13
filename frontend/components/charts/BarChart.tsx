'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
  };
}

export function BarChart({ data }: BarChartProps) {
  // Transform data for Recharts
  const chartData = data.labels.map((label, index) => {
    const item: any = { name: label };
    data.datasets.forEach((dataset) => {
      item[dataset.label] = dataset.data[index] || 0;
    });
    return item;
  });

  const colors = data.datasets.map((dataset, index) => ({
    fill: dataset.backgroundColor || `hsl(${index * 60}, 70%, 50%)`,
    stroke: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar
            key={dataset.label}
            dataKey={dataset.label}
            fill={colors[index].fill}
            stroke={colors[index].stroke}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

