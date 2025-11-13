'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataApi, Dataset } from '@/lib/api/data';
import { Table, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DataTablesPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [tableData, setTableData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await dataApi.getDatasets();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTableData = async (datasetId: string) => {
    try {
      const data = await dataApi.getTableData(datasetId, page, limit);
      setTableData(data);
    } catch (error) {
      console.error('Failed to load table data:', error);
    }
  };

  const handleViewDataset = async (dataset: Dataset) => {
    setSelectedDataset(dataset);
    await loadTableData(dataset.id);
  };

  const handleDelete = async (datasetId: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      await dataApi.deleteDataset(datasetId);
      await loadDatasets();
      if (selectedDataset?.id === datasetId) {
        setSelectedDataset(null);
        setTableData(null);
      }
    } catch (error) {
      console.error('Failed to delete dataset:', error);
      alert('Failed to delete dataset');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading datasets...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Tables</h1>
        <p className="text-gray-600 mt-1">View and manage your datasets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datasets List */}
        <div className="lg:col-span-1">
          <Card title="Your Datasets">
            {datasets.length === 0 ? (
              <div className="text-center py-8">
                <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No datasets yet</p>
                <Link href="/data/upload">
                  <Button variant="primary">Upload Dataset</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDataset?.id === dataset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleViewDataset(dataset)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{dataset.name}</p>
                        <p className="text-xs text-gray-500">
                          {dataset.rowCount} rows × {dataset.columnCount} cols
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(dataset.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Table Data */}
        <div className="lg:col-span-2">
          {selectedDataset ? (
            <Card title={selectedDataset.name}>
              {tableData ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {tableData.columns.map((col: string, idx: number) => (
                            <th
                              key={idx}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.data.map((row: any[], rowIdx: number) => (
                          <tr key={rowIdx} className="hover:bg-gray-50">
                            {row.map((cell: any, cellIdx: number) => (
                              <td
                                key={cellIdx}
                                className="px-4 py-3 text-sm text-gray-900"
                              >
                                {String(cell || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {tableData.pagination && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, tableData.pagination.total)} of {tableData.pagination.total} rows
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => p + 1)}
                          disabled={page >= tableData.pagination.totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click on a dataset to view data</p>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Table className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Select a dataset to view its data</p>
                <p className="text-sm text-gray-500">
                  Click on a dataset from the list to see the table data
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

