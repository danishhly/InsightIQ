import apiClient from './client';

export interface AIQueryRequest {
  datasetId: string;
  query: string;
}

export interface AIQueryResponse {
  naturalQuery: string;
  sqlQuery: string;
  result: {
    columns: string[];
    rows: any[][];
    rowCount: number;
    executionTime: number;
  };
}

export const aiApi = {
  query: async (data: AIQueryRequest): Promise<AIQueryResponse> => {
    const response = await apiClient.post('/ai/query', data);
    return response.data.data;
  },

  generateInsight: async (data: {
    chartId?: string;
    chartType: string;
    data: any;
    columns: string[];
  }) => {
    const response = await apiClient.post('/ai/generate-insight', data);
    return response.data.data;
  },

  validateSQL: async (sqlQuery: string): Promise<boolean> => {
    const response = await apiClient.post('/ai/validate-sql', { sqlQuery });
    return response.data.success;
  },
};

