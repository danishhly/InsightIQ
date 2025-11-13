/**
 * SQL Generation Prompt Template
 * 
 * This prompt is used to convert natural language queries to SQL
 */

export function buildSQLGenerationPrompt(
  userQuery: string,
  schema: any[],
  sampleData?: any[][]
): string {
  const schemaDescription = schema
    .map((col) => `- ${col.name} (${col.type})`)
    .join('\n');

  const sampleRows = sampleData
    ? sampleData
        .slice(0, 3)
        .map((row) => row.join(', '))
        .join('\n')
    : '';

  return `You are a SQL expert. Convert the following natural language query into a SQL SELECT statement.

Database Schema:
${schemaDescription}

${sampleRows ? `Sample Data (first 3 rows):\n${sampleRows}\n` : ''}

User Query: "${userQuery}"

Requirements:
1. Generate ONLY a SELECT query (no DROP, DELETE, INSERT, UPDATE, etc.)
2. Use column names exactly as shown in the schema
3. The table name is "data"
4. Return ONLY the SQL query, no explanations
5. Use proper SQL syntax
6. If the query asks for aggregation, use appropriate functions (COUNT, SUM, AVG, etc.)
7. If the query asks for sorting, use ORDER BY
8. If the query asks for filtering, use WHERE with appropriate conditions

SQL Query:`;
}

export function buildSQLRefinementPrompt(
  originalQuery: string,
  error: string,
  schema: any[]
): string {
  const schemaDescription = schema
    .map((col) => `- ${col.name} (${col.type})`)
    .join('\n');

  return `You are a SQL expert. The following SQL query failed with an error. Generate a corrected version.

Database Schema:
${schemaDescription}

Original Query: "${originalQuery}"
Error: "${error}"

Requirements:
1. Fix the error in the query
2. Generate ONLY a SELECT query
3. Use column names exactly as shown in the schema
4. The table name is "data"
5. Return ONLY the corrected SQL query, no explanations

Corrected SQL Query:`;
}

