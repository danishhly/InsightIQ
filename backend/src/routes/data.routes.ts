import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { dataService } from '../services/data.service';

const router = express.Router();

/**
 * POST /api/data/upload
 * Upload and parse CSV/Excel file
 */
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No file uploaded',
          },
        });
      }

      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const dataset = await dataService.uploadFile({
        userId: req.userId,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        buffer: req.file.buffer,
      });

      res.status(201).json({
        success: true,
        data: dataset,
        message: 'File uploaded and parsed successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message || 'File upload failed',
        },
      });
    }
  }
);

/**
 * GET /api/data
 * Get all datasets for current user
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

    const datasets = await dataService.getUserDatasets(req.userId);

    res.json({
      success: true,
      data: datasets,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get datasets',
      },
    });
  }
});

/**
 * GET /api/data/:id
 * Get dataset by ID
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

    const dataset = await dataService.getDatasetById(req.params.id, req.userId);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Dataset not found',
        },
      });
    }

    res.json({
      success: true,
      data: dataset,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Failed to get dataset',
      },
    });
  }
});

/**
 * GET /api/data/:id/table
 * Get table data (paginated)
 */
router.get('/:id/table', authenticate, async (req: AuthRequest, res) => {
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    const result = await dataService.getTableData(
      req.params.id,
      req.userId,
      page,
      limit
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Dataset not found',
      },
    });
  }
});

/**
 * DELETE /api/data/:id
 * Delete dataset
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

    await dataService.deleteDataset(req.params.id, req.userId);

    res.json({
      success: true,
      message: 'Dataset deleted successfully',
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Dataset not found',
      },
    });
  }
});

export default router;

