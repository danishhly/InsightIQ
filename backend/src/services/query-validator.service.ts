/**
 * SQL Query Validator Service
 * 
 * Validates SQL queries to prevent SQL injection and ensure only safe operations
 */

export class QueryValidatorService {
  // Allowed SQL keywords (only SELECT operations)
  private readonly ALLOWED_KEYWORDS = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'ORDER BY',
    'HAVING',
    'LIMIT',
    'OFFSET',
    'AS',
    'AND',
    'OR',
    'IN',
    'NOT',
    'IS',
    'NULL',
    'COUNT',
    'SUM',
    'AVG',
    'MAX',
    'MIN',
    'DISTINCT',
    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',
  ];

  // Forbidden SQL keywords (dangerous operations)
  private readonly FORBIDDEN_KEYWORDS = [
    'DROP',
    'DELETE',
    'INSERT',
    'UPDATE',
    'ALTER',
    'CREATE',
    'TRUNCATE',
    'EXEC',
    'EXECUTE',
    'GRANT',
    'REVOKE',
    'COMMIT',
    'ROLLBACK',
    'UNION',
    '--',
    '/*',
    '*/',
  ];

  /**
   * Validate SQL query
   * Returns true if query is safe, throws error if not
   */
  validateQuery(query: string): boolean {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    const upperQuery = query.toUpperCase().trim();

    // Check for forbidden keywords
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (upperQuery.includes(keyword)) {
        throw new Error(`Forbidden SQL keyword detected: ${keyword}`);
      }
    }

    // Must start with SELECT
    if (!upperQuery.startsWith('SELECT')) {
      throw new Error('Query must start with SELECT');
    }

    // Check for SQL injection patterns
    const injectionPatterns = [
      /;\s*(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE)/i,
      /--/,
      /\/\*/,
      /\*\//,
      /UNION\s+SELECT/i,
      /EXEC\s*\(/i,
      /xp_/i, // SQL Server extended procedures
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(query)) {
        throw new Error('Potential SQL injection detected');
      }
    }

    // Check for balanced parentheses (basic syntax check)
    const openParens = (query.match(/\(/g) || []).length;
    const closeParens = (query.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      throw new Error('Unbalanced parentheses in query');
    }

    return true;
  }

  /**
   * Sanitize table name (prevent injection through table names)
   */
  sanitizeTableName(tableName: string): string {
    // Only allow alphanumeric, underscore, and dash
    const sanitized = tableName.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitized !== tableName) {
      throw new Error('Invalid table name characters');
    }
    return sanitized;
  }

  /**
   * Validate that query only references allowed tables
   */
  validateTableAccess(query: string, allowedTables: string[]): boolean {
    const upperQuery = query.toUpperCase();
    
    // Extract table names from query (simple extraction)
    const fromMatch = upperQuery.match(/FROM\s+(\w+)/i);
    if (fromMatch) {
      const tableName = fromMatch[1].toLowerCase();
      if (!allowedTables.includes(tableName)) {
        throw new Error(`Access to table '${tableName}' is not allowed`);
      }
    }

    return true;
  }

  /**
   * Extract table names from query
   */
  extractTableNames(query: string): string[] {
    const tables: string[] = [];
    const upperQuery = query.toUpperCase();
    
    // Simple regex to find FROM clauses
    const fromMatches = upperQuery.matchAll(/FROM\s+(\w+)/gi);
    for (const match of fromMatches) {
      if (match[1]) {
        tables.push(match[1].toLowerCase());
      }
    }

    return tables;
  }
}

export const queryValidatorService = new QueryValidatorService();

