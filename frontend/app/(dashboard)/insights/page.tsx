'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatInterface } from '@/components/ai/ChatInterface';
import { dataApi } from '@/lib/api/data';
import { Lightbulb } from 'lucide-react';

export default function InsightsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await dataApi.getDatasets();
      setDatasets(data);
      if (data.length > 0) {
        setSelectedDataset(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (datasets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Datasets Found</h2>
          <p className="text-gray-600 mb-4">
            Upload a dataset first to start asking questions
          </p>
          <a
            href="/data/upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Dataset
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600 mt-1">Ask questions about your data in natural language</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Dataset
        </label>
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {datasets.map((dataset) => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name} ({dataset.rowCount} rows)
            </option>
          ))}
        </select>
      </div>

      {selectedDataset && (
        <div className="h-[600px]">
          <ChatInterface datasetId={selectedDataset} />
        </div>
      )}
    </div>
  );
}

