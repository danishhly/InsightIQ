import apiClient from './client';

export interface Dataset {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  rowCount: number;
  columnCount: number;
  schema: any;
  createdAt: string;
  tables?: any[];
}

export interface TableData {
  data: any[][];
  columns: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const dataApi = {
  uploadFile: async (file: File): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getDatasets: async (): Promise<Dataset[]> => {
    const response = await apiClient.get('/data');
    return response.data.data;
  },

  getDataset: async (id: string): Promise<Dataset> => {
    const response = await apiClient.get(`/data/${id}`);
    return response.data.data;
  },

  getTableData: async (id: string, page: number = 1, limit: number = 100): Promise<TableData> => {
    const response = await apiClient.get(`/data/${id}/table`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  deleteDataset: async (id: string): Promise<void> => {
    await apiClient.delete(`/data/${id}`);
  },
};

