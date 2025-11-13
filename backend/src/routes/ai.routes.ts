import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { aiService } from '../services/ai.service';
import { queryService } from '../services/query.service';
import { queryValidatorService } from '../services/query-validator.service';
import { dataService } from '../services/data.service';
import { insightService } from '../services/insight.service';

const router = express.Router();

/**
 * POST /api/ai/query
 * Convert natural language to SQL and execute
 */
router.post('/query', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    const { datasetId, query: naturalQuery } = req.body;

    // Validation
    if (!datasetId || !naturalQuery) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'datasetId and query are required',
        },
      });
    }

    // Check if AI is available
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'AI_UNAVAILABLE',
          message: 'AI service is not available. Please configure OPENAI_API_KEY in your .env file.',
        },
      });
    }

    // Get dataset
    const dataset = await dataService.getDatasetById(datasetId, req.userId);
    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Dataset not found',
        },
      });
    }

    // Get sample data for context
    const tableResult = await dataService.getTableData(datasetId, req.userId, 1, 10);
    const sampleData = tableResult.data.slice(0, 3);

    // Convert natural language to SQL
    let sqlQuery: string;
    try {
      sqlQuery = await aiService.textToSQL({
        userQuery: naturalQuery,
        schema: dataset.schema as any[],
        sampleData,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'AI_ERROR',
          message: error.message || 'Failed to generate SQL query',
        },
      });
    }

    // Validate SQL query
    try {
      queryValidatorService.validateQuery(sqlQuery);
    } catch (error: any) {
      // Try to refine the query
      try {
        sqlQuery = await aiService.refineSQL(
          sqlQuery,
          error.message,
          dataset.schema as any[]
        );
        queryValidatorService.validateQuery(sqlQuery);
      } catch (refineError: any) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: `Generated SQL query is invalid: ${error.message}`,
            generatedQuery: sqlQuery,
          },
        });
      }
    }

    // Execute query
    let queryResult;
    try {
      queryResult = await queryService.executeQuery({
        userId: req.userId,
        datasetId,
        sqlQuery,
      });
    } catch (error: any) {
      // Try to refine and retry once
      try {
        const refinedQuery = await aiService.refineSQL(
          sqlQuery,
          error.message,
          dataset.schema as any[]
        );
        queryValidatorService.validateQuery(refinedQuery);
        queryResult = await queryService.executeQuery({
          userId: req.userId,
          datasetId,
          sqlQuery: refinedQuery,
        });
        sqlQuery = refinedQuery; // Use refined query
      } catch (retryError: any) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_EXECUTION_ERROR',
            message: error.message || 'Query execution failed',
            generatedQuery: sqlQuery,
          },
        });
      }
    }

    // Save query to history
    await queryService.saveQuery(
      req.userId,
      naturalQuery,
      sqlQuery,
      queryResult
    );

    res.json({
      success: true,
      data: {
        naturalQuery,
        sqlQuery,
        result: queryResult,
      },
      message: 'Query executed successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
});

/**
 * POST /api/ai/generate-insight
 * Generate AI insight for a chart
 */
router.post('/generate-insight', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    const { chartId, chartType, data, columns } = req.body;

    // Validation
    if (!chartType || !data || !columns) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'chartType, data, and columns are required',
        },
      });
    }

    // Check if AI is available
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'AI_UNAVAILABLE',
          message: 'AI service is not available. Please configure OPENAI_API_KEY.',
        },
      });
    }

    // Ensure data is in correct format
    let formattedData = data;
    if (data && data.labels && data.datasets) {
      // Chart data format from chart service
      formattedData = data;
    } else if (Array.isArray(data)) {
      // Raw data array
      formattedData = { data };
    }

    const insight = await insightService.generateChartInsight({
      userId: req.userId,
      chartId: chartId || null,
      chartType,
      data: formattedData,
      columns,
    });

    res.json({
      success: true,
      data: insight,
      message: 'Insight generated successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INSIGHT_ERROR',
        message: error.message || 'Failed to generate insight',
      },
    });
  }
});

/**
 * POST /api/ai/validate-sql
 * Validate SQL query (helper endpoint)
 */
router.post('/validate-sql', authenticate, async (req: AuthRequest, res) => {
  try {
    const { sqlQuery } = req.body;

    if (!sqlQuery) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'sqlQuery is required',
        },
      });
    }

    try {
      queryValidatorService.validateQuery(sqlQuery);
      res.json({
        success: true,
        message: 'SQL query is valid',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_QUERY',
          message: error.message || 'SQL query is invalid',
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
});

export default router;

