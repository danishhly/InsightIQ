import OpenAI from 'openai';
import { config } from '../config/env.config';
import { buildSQLGenerationPrompt, buildSQLRefinementPrompt } from '../prompts/sql-generation.prompt';
import { buildInsightPrompt, buildDataSummaryPrompt } from '../prompts/insight-generation.prompt';

export interface TextToSQLRequest {
  userQuery: string;
  schema: any[];
  sampleData?: any[][];
}

export interface InsightRequest {
  chartType: string;
  data: any;
  columns: string[];
}

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    // Initialize OpenAI client if API key is available
    if (config.openaiApiKey && config.openaiApiKey !== '') {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey,
      });
    }
  }

  /**
   * Check if AI is available
   */
  isAvailable(): boolean {
    return this.openai !== null;
  }

  /**
   * Convert natural language to SQL query
   */
  async textToSQL(request: TextToSQLRequest): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const prompt = buildSQLGenerationPrompt(
        request.userQuery,
        request.schema,
        request.sampleData
      );

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using cheaper model for cost efficiency
        messages: [
          {
            role: 'system',
            content: 'You are a SQL expert. Generate only SQL SELECT queries. Never include DROP, DELETE, INSERT, UPDATE, or any other non-SELECT operations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent SQL generation
        max_tokens: 500,
      });

      const sqlQuery = completion.choices[0]?.message?.content?.trim() || '';

      // Clean up the SQL query (remove markdown code blocks if present)
      const cleanedQuery = sqlQuery
        .replace(/```sql\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();

      if (!cleanedQuery) {
        throw new Error('Failed to generate SQL query');
      }

      return cleanedQuery;
    } catch (error: any) {
      if (error.message?.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing');
      }
      throw new Error(`AI service error: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Refine SQL query based on error
   */
  async refineSQL(
    originalQuery: string,
    error: string,
    schema: any[]
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const prompt = buildSQLRefinementPrompt(originalQuery, error, schema);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a SQL expert. Fix SQL query errors and return only the corrected SQL query.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
      });

      const sqlQuery = completion.choices[0]?.message?.content?.trim() || '';

      const cleanedQuery = sqlQuery
        .replace(/```sql\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();

      return cleanedQuery || originalQuery;
    } catch (error: any) {
      throw new Error(`AI refinement error: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate insights from chart data
   */
  async generateInsight(request: InsightRequest): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const prompt = buildInsightPrompt(
        request.chartType,
        request.data,
        request.columns
      );

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst. Provide concise, data-driven insights based on the chart data provided.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const insight = completion.choices[0]?.message?.content?.trim() || '';

      return insight || 'Unable to generate insights at this time.';
    } catch (error: any) {
      throw new Error(`Insight generation error: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate dataset summary
   */
  async generateDatasetSummary(
    datasetName: string,
    rowCount: number,
    columns: string[],
    sampleData: any[][]
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const prompt = buildDataSummaryPrompt(
        datasetName,
        rowCount,
        columns,
        sampleData
      );

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst. Provide concise summaries of datasets.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      const summary = completion.choices[0]?.message?.content?.trim() || '';

      return summary || 'Unable to generate summary at this time.';
    } catch (error: any) {
      throw new Error(`Summary generation error: ${error.message || 'Unknown error'}`);
    }
  }
}

export const aiService = new AIService();

