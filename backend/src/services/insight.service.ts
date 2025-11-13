import { PrismaClient, Insight, InsightType } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { aiService } from './ai.service';
import { chartService } from './chart.service';

export interface GenerateInsightDto {
  userId: string;
  chartId?: string;
  datasetId?: string;
  chartType?: string;
  data?: any;
  columns?: string[];
}

export class InsightService {
  /**
   * Generate insight for a chart
   */
  async generateChartInsight(data: GenerateInsightDto): Promise<Insight> {
    const { userId, chartId, chartType, data: chartData, columns } = data;

    if (!chartType || !chartData || !columns) {
      throw new Error('Chart type, data, and columns are required');
    }

    // Check if AI is available
    if (!aiService.isAvailable()) {
      throw new Error('AI service is not available. Please configure OPENAI_API_KEY.');
    }

    // Generate insight using AI
    const insightContent = await aiService.generateInsight({
      chartType,
      data: chartData,
      columns,
    });

    // Determine insight type based on chart type
    let insightType: InsightType = 'SUMMARY';
    if (chartType === 'LINE' || chartType === 'AREA') {
      insightType = 'TREND';
    } else if (chartType === 'PIE') {
      insightType = 'COMPARISON';
    }

    // Save insight
    const insight = await prisma.insight.create({
      data: {
        userId,
        chartId: chartId || null,
        content: insightContent,
        type: insightType,
        metadata: {
          chartType,
          generatedAt: new Date().toISOString(),
        } as any,
      },
    });

    return insight;
  }

  /**
   * Get all insights for a user
   */
  async getUserInsights(userId: string): Promise<Insight[]> {
    return prisma.insight.findMany({
      where: { userId },
      include: {
        chart: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get insight by ID
   */
  async getInsightById(insightId: string, userId: string): Promise<Insight | null> {
    return prisma.insight.findFirst({
      where: {
        id: insightId,
        userId,
      },
      include: {
        chart: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  /**
   * Delete insight
   */
  async deleteInsight(insightId: string, userId: string): Promise<void> {
    const insight = await this.getInsightById(insightId, userId);
    if (!insight) {
      throw new Error('Insight not found');
    }

    await prisma.insight.delete({
      where: { id: insightId },
    });
  }
}

export const insightService = new InsightService();

