import { PrismaClient } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { queryValidatorService } from './query-validator.service';
import { dataService } from './data.service';

export interface ExecuteQueryDto {
  userId: string;
  datasetId: string;
  sqlQuery: string;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
}

export class QueryService {
  /**
   * Execute SQL query on dataset
   * Note: This is a simplified implementation. In production, you'd use a proper SQL engine
   */
  async executeQuery(data: ExecuteQueryDto): Promise<QueryResult> {
    const { userId, datasetId, sqlQuery } = data;
    const startTime = Date.now();

    // Validate query
    queryValidatorService.validateQuery(sqlQuery);

    // Get dataset
    const dataset = await dataService.getDatasetById(datasetId, userId);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Get table data
    const tableResult = await dataService.getTableData(datasetId, userId, 1, 100000);
    const { data: rows, columns } = tableResult;

    if (rows.length === 0) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTime: Date.now() - startTime,
      };
    }

    // Simple SQL execution (for SELECT queries only)
    // This is a basic implementation - in production, use a proper SQL engine
    const result = this.executeSimpleSelect(sqlQuery, columns, rows);

    return {
      ...result,
      executionTime: Date.now() - startTime,
    };
  }

  /**
   * Simple SELECT query executor
   * This is a basic implementation for demonstration
   * In production, consider using a proper SQL engine like SQL.js or a database
   */
  private executeSimpleSelect(
    query: string,
    columns: string[],
    rows: any[][]
  ): { columns: string[]; rows: any[][]; rowCount: number } {
    const upperQuery = query.toUpperCase().trim();

    // Parse SELECT clause
    const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
    if (!selectMatch) {
      throw new Error('Invalid SELECT query format');
    }

    const selectClause = selectMatch[1].trim();
    const isSelectAll = selectClause === '*' || selectClause.toUpperCase() === '*';

    // Determine output columns
    let outputColumns: string[] = [];
    if (isSelectAll) {
      outputColumns = columns;
    } else {
      // Parse column list
      const columnList = selectClause.split(',').map((col) => col.trim());
      outputColumns = columnList.map((col) => {
        // Handle "column AS alias"
        const aliasMatch = col.match(/\s+AS\s+(\w+)/i);
        if (aliasMatch) {
          return aliasMatch[1];
        }
        // Remove table prefix if present
        return col.split('.').pop() || col;
      });
    }

    // Apply WHERE clause if present
    let filteredRows = rows;
    const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      filteredRows = this.applyWhereClause(rows, columns, whereClause);
    }

    // Apply ORDER BY if present
    const orderByMatch = query.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderByMatch) {
      const orderColumn = orderByMatch[1].trim();
      const direction = (orderByMatch[2] || 'ASC').toUpperCase();
      const columnIndex = columns.indexOf(orderColumn);
      if (columnIndex !== -1) {
        filteredRows = [...filteredRows].sort((a, b) => {
          const aVal = a[columnIndex];
          const bVal = b[columnIndex];
          if (direction === 'DESC') {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
          }
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
      }
    }

    // Apply LIMIT if present
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      filteredRows = filteredRows.slice(0, limit);
    }

    // Select columns
    const resultRows = filteredRows.map((row) => {
      if (isSelectAll) {
        return row;
      }
      // Map selected columns
      return outputColumns.map((col) => {
        const colIndex = columns.indexOf(col);
        return colIndex !== -1 ? row[colIndex] : null;
      });
    });

    return {
      columns: outputColumns,
      rows: resultRows,
      rowCount: resultRows.length,
    };
  }

  /**
   * Apply WHERE clause (basic implementation)
   */
  private applyWhereClause(
    rows: any[][],
    columns: string[],
    whereClause: string
  ): any[][] {
    // Simple WHERE clause parser (supports basic comparisons)
    // This is a simplified version - production would need a full SQL parser

    const conditions = whereClause.split(/\s+AND\s+|\s+OR\s+/i);
    
    return rows.filter((row) => {
      return conditions.some((condition) => {
        // Parse condition like "column = value" or "column > value"
        const match = condition.match(/(\w+)\s*(=|!=|>|<|>=|<=|LIKE)\s*(.+)/i);
        if (!match) return true;

        const [, column, operator, value] = match;
        const columnIndex = columns.indexOf(column.trim());
        if (columnIndex === -1) return false;

        const cellValue = String(row[columnIndex] || '');
        const compareValue = value.trim().replace(/['"]/g, '');

        switch (operator.toUpperCase()) {
          case '=':
            return cellValue === compareValue;
          case '!=':
            return cellValue !== compareValue;
          case '>':
            return Number(cellValue) > Number(compareValue);
          case '<':
            return Number(cellValue) < Number(compareValue);
          case '>=':
            return Number(cellValue) >= Number(compareValue);
          case '<=':
            return Number(cellValue) <= Number(compareValue);
          case 'LIKE':
            const pattern = compareValue.replace(/%/g, '.*').replace(/_/g, '.');
            return new RegExp(pattern, 'i').test(cellValue);
          default:
            return true;
        }
      });
    });
  }

  /**
   * Save query to history
   */
  async saveQuery(
    userId: string,
    naturalQuery: string,
    sqlQuery: string,
    result: QueryResult
  ): Promise<void> {
    await prisma.query.create({
      data: {
        userId,
        naturalQuery,
        sqlQuery,
        result: {
          columns: result.columns,
          rows: result.rows.slice(0, 100), // Store first 100 rows
          rowCount: result.rowCount,
        } as any,
      },
    });
  }

  /**
   * Get query history for user
   */
  async getUserQueries(userId: string) {
    return prisma.query.findMany({
      where: { userId },
      orderBy: { executedAt: 'desc' },
      take: 50, // Last 50 queries
    });
  }
}

export const queryService = new QueryService();

