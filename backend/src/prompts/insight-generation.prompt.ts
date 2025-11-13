/**
 * Insight Generation Prompt Template
 * 
 * This prompt is used to generate insights from data and charts
 */

export function buildInsightPrompt(
  chartType: string,
  data: any,
  columns: string[]
): string {
  return `You are a data analyst. Analyze the following chart data and provide key insights.

Chart Type: ${chartType}
Columns: ${columns.join(', ')}

Data Summary:
${JSON.stringify(data, null, 2)}

Provide insights in the following format:
1. **Main Finding**: One sentence summary
2. **Key Observations**: 2-3 bullet points
3. **Recommendations**: 1-2 actionable recommendations

Be concise, data-driven, and specific. Focus on patterns, trends, and anomalies.`;
}

export function buildDataSummaryPrompt(
  datasetName: string,
  rowCount: number,
  columns: string[],
  sampleData: any[][]
): string {
  const sampleRows = sampleData
    .slice(0, 5)
    .map((row, i) => `${i + 1}. ${row.join(' | ')}`)
    .join('\n');

  return `You are a data analyst. Provide a brief summary of this dataset.

Dataset: ${datasetName}
Rows: ${rowCount}
Columns: ${columns.join(', ')}

Sample Data:
${sampleRows}

Provide:
1. **Dataset Overview**: What type of data is this?
2. **Key Columns**: What are the most important columns?
3. **Data Quality**: Any obvious issues or patterns?

Be concise (2-3 sentences per section).`;
}

