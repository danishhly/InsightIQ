import { PrismaClient, Dataset, DataTable } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { CSVParser, ParsedData } from '../parsers/csv.parser';
import { ExcelParser } from '../parsers/excel.parser';

export interface UploadDataDto {
  userId: string;
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

export interface DatasetWithTables extends Dataset {
  tables: DataTable[];
}

export class DataService {
  private csvParser = new CSVParser();
  private excelParser = new ExcelParser();

  /**
   * Upload and parse file
   */
  async uploadFile(data: UploadDataDto): Promise<DatasetWithTables> {
    const { userId, fileName, fileType, buffer } = data;

    // Parse file based on type
    let parsedData: ParsedData;

    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      parsedData = await this.csvParser.parse(buffer);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.ms-excel' ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls')
    ) {
      parsedData = await this.excelParser.parse(buffer);
    } else {
      throw new Error('Unsupported file type. Only CSV and Excel files are supported.');
    }

    // Extract schema metadata
    const schema = this.extractSchema(parsedData);

    // Create dataset
    const dataset = await prisma.dataset.create({
      data: {
        userId,
        name: fileName.replace(/\.[^/.]+$/, ''), // Remove extension
        fileName,
        fileType: fileType || (fileName.endsWith('.csv') ? 'csv' : 'xlsx'),
        rowCount: parsedData.rowCount,
        columnCount: parsedData.columnCount,
        schema: schema as any,
      },
    });

    // Create data table
    const dataTable = await prisma.dataTable.create({
      data: {
        datasetId: dataset.id,
        tableName: 'main',
        columns: schema as any,
        data: parsedData.rows.slice(0, 1000) as any, // Store first 1000 rows (for large files)
      },
    });

    return {
      ...dataset,
      tables: [dataTable],
    };
  }

  /**
   * Extract schema from parsed data
   */
  private extractSchema(parsedData: ParsedData) {
    const { columns, rows } = parsedData;

    // Sample first 100 rows to infer types
    const sampleRows = rows.slice(0, Math.min(100, rows.length));

    return columns.map((col, index) => {
      const columnValues = sampleRows
        .map((row) => row[index])
        .filter((val) => val !== null && val !== undefined && val !== '');

      let type = 'string';
      if (columnValues.length > 0) {
        // Check if all values are numbers
        const allNumbers = columnValues.every((val) => {
          const num = Number(val);
          return !isNaN(num) && isFinite(num);
        });

        // Check if all values are dates
        const allDates = columnValues.every((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        });

        if (allNumbers) {
          type = 'number';
        } else if (allDates) {
          type = 'date';
        }
      }

      return {
        name: col,
        type,
        nullable: true,
      };
    });
  }

  /**
   * Get all datasets for a user
   */
  async getUserDatasets(userId: string): Promise<DatasetWithTables[]> {
    try {
      const datasets = await prisma.dataset.findMany({
        where: { userId },
        include: { tables: true },
        orderBy: { createdAt: 'desc' },
      });

      // Ensure schema is properly serialized
      return datasets.map((dataset) => ({
        ...dataset,
        schema: dataset.schema || [],
      }));
    } catch (error: any) {
      console.error('Error getting user datasets:', error);
      throw new Error(`Failed to get datasets: ${error.message}`);
    }
  }

  /**
   * Get dataset by ID
   */
  async getDatasetById(datasetId: string, userId: string): Promise<DatasetWithTables | null> {
    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        userId, // Ensure user owns the dataset
      },
      include: { tables: true },
    });

    return dataset;
  }

  /**
   * Get table data (paginated)
   */
  async getTableData(
    datasetId: string,
    userId: string,
    page: number = 1,
    limit: number = 100
  ) {
    const dataset = await this.getDatasetById(datasetId, userId);

    if (!dataset) {
      throw new Error('Dataset not found');
    }

    const table = dataset.tables[0];
    if (!table || !table.data) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const allRows = table.data as any[][];
    const total = allRows.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRows = allRows.slice(offset, offset + limit);

    return {
      data: paginatedRows,
      columns: (table.columns as any[]).map((col) => col.name),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Delete dataset
   */
  async deleteDataset(datasetId: string, userId: string): Promise<void> {
    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        userId,
      },
    });

    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Delete dataset (cascade will delete tables)
    await prisma.dataset.delete({
      where: { id: datasetId },
    });
  }
}

export const dataService = new DataService();

