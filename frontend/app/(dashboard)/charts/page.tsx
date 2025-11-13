'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { chartsApi, Chart } from '@/lib/api/charts';
import { dataApi } from '@/lib/api/data';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { BarChart3, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ChartsPage() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [chartsData, datasetsData] = await Promise.all([
        chartsApi.getCharts(),
        dataApi.getDatasets(),
      ]);
      setCharts(chartsData);
      setDatasets(datasetsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChart = async (chart: Chart) => {
    setSelectedChart(chart);
    // For now, we'll need to get the dataset schema to generate chart data
    // This is a simplified version - in production, you'd have a better flow
    try {
      const dataset = await dataApi.getDataset(chart.datasetId);
      if (dataset.schema && Array.isArray(dataset.schema) && dataset.schema.length >= 2) {
        const xColumn = dataset.schema[0]?.name || 'name';
        const yColumn = dataset.schema[1]?.name || 'value';
        const data = await chartsApi.getChartData(chart.id, xColumn, yColumn);
        setChartData(data);
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const handleDelete = async (chartId: string) => {
    if (!confirm('Are you sure you want to delete this chart?')) return;

    try {
      await chartsApi.deleteChart(chartId);
      await loadData();
      if (selectedChart?.id === chartId) {
        setSelectedChart(null);
        setChartData(null);
      }
    } catch (error) {
      console.error('Failed to delete chart:', error);
      alert('Failed to delete chart');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading charts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Charts</h1>
          <p className="text-gray-600 mt-1">Visualize your data</p>
        </div>
        {datasets.length > 0 && (
          <Link href="/charts/create">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Chart
            </Button>
          </Link>
        )}
      </div>

      {charts.length === 0 ? (
        <Card className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Charts Yet</h2>
          <p className="text-gray-600 mb-4">
            {datasets.length === 0
              ? 'Upload a dataset first to create charts'
              : 'Create your first chart to visualize your data'}
          </p>
          {datasets.length === 0 ? (
            <Link href="/data/upload">
              <Button variant="primary">Upload Dataset</Button>
            </Link>
          ) : (
            <Link href="/charts/create">
              <Button variant="primary">Create Chart</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts List */}
          <div className="lg:col-span-1">
            <Card title="Your Charts">
              <div className="space-y-2">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedChart?.id === chart.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleViewChart(chart)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{chart.name}</p>
                        <p className="text-xs text-gray-500">{chart.type}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chart.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chart Visualization */}
          <div className="lg:col-span-2">
            {selectedChart && chartData ? (
              <ChartContainer
                type={selectedChart.type}
                data={chartData}
                title={selectedChart.name}
              />
            ) : selectedChart ? (
              <Card>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Loading chart data...</p>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Select a chart to view</p>
                  <p className="text-sm text-gray-500">
                    Click on a chart from the list to see the visualization
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

