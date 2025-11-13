import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { queryService, ExecuteQueryDto } from '../services/query.service';

const router = express.Router();

/**
 * POST /api/query/execute
 * Execute SQL query on a dataset
 */
router.post('/execute', authenticate, async (req: AuthRequest, res) => {
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

    const { datasetId, sqlQuery } = req.body;

    // Validation
    if (!datasetId || !sqlQuery) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'datasetId and sqlQuery are required',
        },
      });
    }

    const queryData: ExecuteQueryDto = {
      userId: req.userId,
      datasetId,
      sqlQuery,
    };

    const result = await queryService.executeQuery(queryData);

    // Save query to history
    await queryService.saveQuery(
      req.userId,
      sqlQuery, // For now, naturalQuery = sqlQuery (AI will generate this in Phase 3)
      sqlQuery,
      result
    );

    res.json({
      success: true,
      data: result,
      message: 'Query executed successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'QUERY_ERROR',
        message: error.message || 'Query execution failed',
      },
    });
  }
});

/**
 * GET /api/query/history
 * Get query history for current user
 */
router.get('/history', authenticate, async (req: AuthRequest, res) => {
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

    const queries = await queryService.getUserQueries(req.userId);

    res.json({
      success: true,
      data: queries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get query history',
      },
    });
  }
});

export default router;

