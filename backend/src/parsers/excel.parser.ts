import * as XLSX from 'xlsx';
import { ParsedData } from './csv.parser';

export class ExcelParser {
  /**
   * Parse Excel file buffer
   */
  async parse(buffer: Buffer, sheetIndex: number = 0): Promise<ParsedData> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetNames = workbook.SheetNames;

      if (sheetNames.length === 0) {
        throw new Error('Excel file has no sheets');
      }

      const sheetName = sheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

      if (jsonData.length === 0) {
        throw new Error('Excel sheet is empty');
      }

      // Get column names from first row
      const columns = Object.keys(jsonData[0] as any);

      // Convert to array of arrays
      const rows = (jsonData as any[]).map((row) => {
        return columns.map((col) => row[col] ?? null);
      });

      return {
        columns,
        rows,
        rowCount: rows.length,
        columnCount: columns.length,
      };
    } catch (error) {
      throw new Error('Failed to parse Excel file: ' + (error as Error).message);
    }
  }

  /**
   * Get all sheet names from Excel file
   */
  getSheetNames(buffer: Buffer): string[] {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      return workbook.SheetNames;
    } catch (error) {
      throw new Error('Failed to read Excel file: ' + (error as Error).message);
    }
  }
}

