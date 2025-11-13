'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
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

export function LineChart({ data }: LineChartProps) {
  const chartData = data.labels.map((label, index) => {
    const item: any = { name: label };
    data.datasets.forEach((dataset) => {
      item[dataset.label] = dataset.data[index] || 0;
    });
    return item;
  });

  const colors = data.datasets.map((dataset, index) => ({
    stroke: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Line
            key={dataset.label}
            type="monotone"
            dataKey={dataset.label}
            stroke={colors[index].stroke}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

