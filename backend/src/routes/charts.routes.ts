import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { chartService, CreateChartDto } from '../services/chart.service';
import { ChartType } from '@prisma/client';

const router = express.Router();

/**
 * POST /api/charts
 * Create a new chart
 */
router.post('/', authenticate, async (req: AuthRequest, res) => {
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

    const { datasetId, name, type, config, query } = req.body;

    // Validation
    if (!datasetId || !name || !type) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'datasetId, name, and type are required',
        },
      });
    }

    // Validate chart type
    const validTypes: ChartType[] = ['BAR', 'LINE', 'PIE', 'SCATTER', 'AREA'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid chart type. Must be one of: ${validTypes.join(', ')}`,
        },
      });
    }

    const chartData: CreateChartDto = {
      userId: req.userId,
      datasetId,
      name,
      type,
      config: config || {},
      query: query || null,
    };

    const chart = await chartService.createChart(chartData);

    res.status(201).json({
      success: true,
      data: chart,
      message: 'Chart created successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CHART_CREATION_ERROR',
        message: error.message || 'Failed to create chart',
      },
    });
  }
});

/**
 * GET /api/charts
 * Get all charts for current user
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

    const charts = await chartService.getUserCharts(req.userId);

    res.json({
      success: true,
      data: charts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get charts',
      },
    });
  }
});

/**
 * GET /api/charts/:id
 * Get chart by ID
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

    const chart = await chartService.getChartById(req.params.id, req.userId);

    if (!chart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Chart not found',
        },
      });
    }

    res.json({
      success: true,
      data: chart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get chart',
      },
    });
  }
});

/**
 * PATCH /api/charts/:id
 * Update chart
 */
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
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

    const { name, type, config, query } = req.body;

    const chart = await chartService.updateChart(req.params.id, req.userId, {
      name,
      type,
      config,
      query,
    });

    res.json({
      success: true,
      data: chart,
      message: 'Chart updated successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Chart not found',
      },
    });
  }
});

/**
 * DELETE /api/charts/:id
 * Delete chart
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

    await chartService.deleteChart(req.params.id, req.userId);

    res.json({
      success: true,
      message: 'Chart deleted successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Chart not found',
      },
    });
  }
});

/**
 * POST /api/charts/:id/data
 * Generate chart data from dataset
 */
router.post('/:id/data', authenticate, async (req: AuthRequest, res) => {
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

    const chart = await chartService.getChartById(req.params.id, req.userId);
    if (!chart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Chart not found',
        },
      });
    }

    const { xColumn, yColumn, groupBy } = req.body;

    if (!xColumn || !yColumn) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'xColumn and yColumn are required',
        },
      });
    }

    const chartData = await chartService.generateChartData(
      chart.datasetId,
      req.userId,
      chart.type,
      xColumn,
      yColumn,
      groupBy
    );

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CHART_DATA_ERROR',
        message: error.message || 'Failed to generate chart data',
      },
    });
  }
});

export default router;

