'use client';

import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Card } from '@/components/ui/card';

interface ChartContainerProps {
  type: 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
    }>;
  };
  title?: string;
}

export function ChartContainer({ type, data, title }: ChartContainerProps) {
  const renderChart = () => {
    switch (type) {
      case 'BAR':
        return <BarChart data={data} />;
      case 'LINE':
      case 'AREA':
        return <LineChart data={data} />;
      case 'PIE':
        return <PieChart data={data} />;
      default:
        return <div className="p-8 text-center text-gray-500">Chart type not supported</div>;
    }
  };

  return (
    <Card className="p-6" title={title}>
      {renderChart()}
    </Card>
  );
}

