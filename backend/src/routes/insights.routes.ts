import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { insightService } from '../services/insight.service';

const router = express.Router();

/**
 * GET /api/insights
 * Get all insights for current user
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
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

    const insights = await insightService.getUserInsights(req.userId);

    res.json({
      success: true,
      data: insights,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get insights',
      },
    });
  }
});

/**
 * GET /api/insights/:id
 * Get insight by ID
 */
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
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

    const insight = await insightService.getInsightById(req.params.id, req.userId);

    if (!insight) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Insight not found',
        },
      });
    }

    res.json({
      success: true,
      data: insight,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get insight',
      },
    });
  }
});

/**
 * DELETE /api/insights/:id
 * Delete insight
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
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

    await insightService.deleteInsight(req.params.id, req.userId);

    res.json({
      success: true,
      message: 'Insight deleted successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Insight not found',
      },
    });
  }
});

export default router;

