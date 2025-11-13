import Papa from 'papaparse';

export interface ParsedData {
  columns: string[];
  rows: any[][];
  rowCount: number;
  columnCount: number;
}

export class CSVParser {
  /**
   * Parse CSV file buffer
   */
  async parse(buffer: Buffer): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
      const csvString = buffer.toString('utf-8');

      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const data = results.data as any[];
            
            if (data.length === 0) {
              return reject(new Error('CSV file is empty'));
            }

            // Get column names from first row
            const columns = Object.keys(data[0]);
            
            // Convert to array of arrays
            const rows = data.map((row) => {
              return columns.map((col) => row[col] ?? null);
            });

            resolve({
              columns,
              rows,
              rowCount: rows.length,
              columnCount: columns.length,
            });
          } catch (error) {
            reject(new Error('Failed to parse CSV: ' + (error as Error).message));
          }
        },
        error: (error) => {
          reject(new Error('CSV parsing error: ' + error.message));
        },
      });
    });
  }

  /**
   * Infer data types for columns
   */
  inferTypes(rows: any[][]): Array<{ name: string; type: string }> {
    if (rows.length === 0) return [];

    const columnCount = rows[0].length;
    const types: string[] = [];

    for (let i = 0; i < columnCount; i++) {
      const columnValues = rows.map((row) => row[i]).filter((val) => val !== null && val !== undefined && val !== '');
      
      if (columnValues.length === 0) {
        types.push('string');
        continue;
      }

      // Check if all values are numbers
      const allNumbers = columnValues.every((val) => {
        const num = Number(val);
        return !isNaN(num) && isFinite(num);
      });

      // Check if all values are dates
      const allDates = columnValues.every((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      });

      if (allNumbers) {
        types.push('number');
      } else if (allDates) {
        types.push('date');
      } else {
        types.push('string');
      }
    }

    return types.map((type, index) => ({
      name: `column_${index}`,
      type,
    }));
  }
}

