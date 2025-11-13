import { PrismaClient, Chart, ChartType } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { dataService } from './data.service';

export interface CreateChartDto {
  userId: string;
  datasetId: string;
  name: string;
  type: ChartType;
  config: any;
  query?: string;
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

export class ChartService {
  /**
   * Create a new chart
   */
  async createChart(data: CreateChartDto): Promise<Chart> {
    // Verify dataset exists and user owns it
    const dataset = await dataService.getDatasetById(data.datasetId, data.userId);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    const chart = await prisma.chart.create({
      data: {
        userId: data.userId,
        datasetId: data.datasetId,
        name: data.name,
        type: data.type,
        config: data.config as any,
        query: data.query || null,
      },
    });

    return chart;
  }

  /**
   * Get all charts for a user
   */
  async getUserCharts(userId: string): Promise<Chart[]> {
    return prisma.chart.findMany({
      where: { userId },
      include: {
        dataset: {
          select: {
            id: true,
            name: true,
            fileName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get chart by ID
   */
  async getChartById(chartId: string, userId: string): Promise<Chart | null> {
    return prisma.chart.findFirst({
      where: {
        id: chartId,
        userId, // Ensure user owns the chart
      },
      include: {
        dataset: {
          select: {
            id: true,
            name: true,
            fileName: true,
            schema: true,
          },
        },
      },
    });
  }

  /**
   * Update chart
   */
  async updateChart(
    chartId: string,
    userId: string,
    updates: Partial<CreateChartDto>
  ): Promise<Chart> {
    // Verify chart exists and user owns it
    const existingChart = await this.getChartById(chartId, userId);
    if (!existingChart) {
      throw new Error('Chart not found');
    }

    const chart = await prisma.chart.update({
      where: { id: chartId },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.type && { type: updates.type }),
        ...(updates.config && { config: updates.config as any }),
        ...(updates.query !== undefined && { query: updates.query }),
      },
    });

    return chart;
  }

  /**
   * Delete chart
   */
  async deleteChart(chartId: string, userId: string): Promise<void> {
    const chart = await this.getChartById(chartId, userId);
    if (!chart) {
      throw new Error('Chart not found');
    }

    await prisma.chart.delete({
      where: { id: chartId },
    });
  }

  /**
   * Generate chart data from dataset
   * This prepares data in a format ready for chart libraries (Chart.js, Recharts, etc.)
   */
  async generateChartData(
    datasetId: string,
    userId: string,
    chartType: ChartType,
    xColumn: string,
    yColumn: string,
    groupBy?: string
  ): Promise<ChartData> {
    // Get dataset
    const dataset = await dataService.getDatasetById(datasetId, userId);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Get table data
    const tableResult = await dataService.getTableData(datasetId, userId, 1, 10000);
    const { data: rows, columns } = tableResult;

    if (rows.length === 0) {
      throw new Error('Dataset is empty');
    }

    // Find column indices
    const xIndex = columns.indexOf(xColumn);
    const yIndex = columns.indexOf(yColumn);

    if (xIndex === -1 || yIndex === -1) {
      throw new Error('Column not found');
    }

    // Extract data based on chart type
    switch (chartType) {
      case 'BAR':
      case 'LINE':
      case 'AREA':
        return this.generateBarLineAreaData(rows, xIndex, yIndex, groupBy, columns);

      case 'PIE':
        return this.generatePieData(rows, xIndex, yIndex);

      case 'SCATTER':
        return this.generateScatterData(rows, xIndex, yIndex);

      default:
        throw new Error('Unsupported chart type');
    }
  }

  /**
   * Generate data for Bar, Line, or Area charts
   */
  private generateBarLineAreaData(
    rows: any[][],
    xIndex: number,
    yIndex: number,
    groupBy: string | undefined,
    columns: string[]
  ): ChartData {
    const labels: string[] = [];
    const dataMap = new Map<string, number[]>();

    if (groupBy) {
      const groupIndex = columns.indexOf(groupBy);
      if (groupIndex === -1) {
        throw new Error('Group by column not found');
      }

      // Group data by the groupBy column
      const groups = new Set<string>();
      rows.forEach((row) => {
        const xValue = String(row[xIndex] || '');
        const groupValue = String(row[groupIndex] || '');
        groups.add(groupValue);

        if (!labels.includes(xValue)) {
          labels.push(xValue);
        }
      });

      // Initialize data arrays for each group
      groups.forEach((group) => {
        dataMap.set(group, new Array(labels.length).fill(0));
      });

      // Populate data
      rows.forEach((row) => {
        const xValue = String(row[xIndex] || '');
        const yValue = Number(row[yIndex]) || 0;
        const groupValue = String(row[groupIndex] || '');

        const labelIndex = labels.indexOf(xValue);
        const groupData = dataMap.get(groupValue) || [];
        groupData[labelIndex] = (groupData[labelIndex] || 0) + yValue;
        dataMap.set(groupValue, groupData);
      });

      // Convert to datasets array
      const datasets = Array.from(dataMap.entries()).map(([label, data], index) => ({
        label,
        data,
        backgroundColor: this.getColor(index, 0.7),
        borderColor: this.getColor(index, 1),
      }));

      return { labels, datasets };
    } else {
      // Simple single dataset
      const data: number[] = [];
      rows.forEach((row) => {
        const xValue = String(row[xIndex] || '');
        const yValue = Number(row[yIndex]) || 0;

        if (!labels.includes(xValue)) {
          labels.push(xValue);
          data.push(yValue);
        } else {
          const index = labels.indexOf(xValue);
          data[index] = (data[index] || 0) + yValue;
        }
      });

      return {
        labels,
        datasets: [
          {
            label: columns[yIndex],
            data,
            backgroundColor: this.getColor(0, 0.7),
            borderColor: this.getColor(0, 1),
          },
        ],
      };
    }
  }

  /**
   * Generate data for Pie chart
   */
  private generatePieData(rows: any[][], xIndex: number, yIndex: number): ChartData {
    const dataMap = new Map<string, number>();

    rows.forEach((row) => {
      const label = String(row[xIndex] || '');
      const value = Number(row[yIndex]) || 0;
      dataMap.set(label, (dataMap.get(label) || 0) + value);
    });

    const labels = Array.from(dataMap.keys());
    const data = Array.from(dataMap.values());

    return {
      labels,
      datasets: [
        {
          label: 'Data',
          data,
          backgroundColor: labels.map((_, i) => this.getColor(i, 0.7)),
          borderColor: labels.map((_, i) => this.getColor(i, 1)),
        },
      ],
    };
  }

  /**
   * Generate data for Scatter chart
   */
  private generateScatterData(rows: any[][], xIndex: number, yIndex: number): ChartData {
    const data = rows.map((row) => ({
      x: Number(row[xIndex]) || 0,
      y: Number(row[yIndex]) || 0,
    }));

    return {
      labels: [],
      datasets: [
        {
          label: 'Data Points',
          data: data.map((d) => d.y),
          backgroundColor: this.getColor(0, 0.5),
          borderColor: this.getColor(0, 1),
        },
      ],
    };
  }

  /**
   * Get color for chart (simple color palette)
   */
  private getColor(index: number, alpha: number): string {
    const colors = [
      'rgba(54, 162, 235, {alpha})',   // Blue
      'rgba(255, 99, 132, {alpha})',   // Red
      'rgba(75, 192, 192, {alpha})',   // Teal
      'rgba(255, 206, 86, {alpha})',   // Yellow
      'rgba(153, 102, 255, {alpha})',  // Purple
      'rgba(255, 159, 64, {alpha})',   // Orange
    ];

    const color = colors[index % colors.length];
    return color.replace('{alpha}', alpha.toString());
  }
}

export const chartService = new ChartService();

