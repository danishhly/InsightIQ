import apiClient from './client';

export interface Chart {
  id: string;
  userId: string;
  datasetId: string;
  name: string;
  type: 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA';
  config: any;
  query?: string;
  createdAt: string;
  dataset?: {
    id: string;
    name: string;
    fileName: string;
  };
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export const chartsApi = {
  createChart: async (data: {
    datasetId: string;
    name: string;
    type: string;
    config?: any;
    query?: string;
  }): Promise<Chart> => {
    const response = await apiClient.post('/charts', data);
    return response.data.data;
  },

  getCharts: async (): Promise<Chart[]> => {
    const response = await apiClient.get('/charts');
    return response.data.data;
  },

  getChart: async (id: string): Promise<Chart> => {
    const response = await apiClient.get(`/charts/${id}`);
    return response.data.data;
  },

  updateChart: async (id: string, data: Partial<Chart>): Promise<Chart> => {
    const response = await apiClient.patch(`/charts/${id}`, data);
    return response.data.data;
  },

  deleteChart: async (id: string): Promise<void> => {
    await apiClient.delete(`/charts/${id}`);
  },

  getChartData: async (
    id: string,
    xColumn: string,
    yColumn: string,
    groupBy?: string
  ): Promise<ChartData> => {
    const response = await apiClient.post(`/charts/${id}/data`, {
      xColumn,
      yColumn,
      groupBy,
    });
    return response.data.data;
  },
};

