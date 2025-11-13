'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, File, X, Check } from 'lucide-react';
import { dataApi } from '@/lib/api/data';

export function DataUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [uploadedDataset, setUploadedDataset] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const validExtensions = ['.csv', '.xlsx', '.xls'];
      const fileExt = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));

      if (
        validTypes.includes(selectedFile.type) ||
        validExtensions.includes(fileExt)
      ) {
        // Validate file size (10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
          setError('File size must be less than 10MB');
          return;
        }
        setFile(selectedFile);
        setError('');
        setUploadStatus('idle');
      } else {
        setError('Invalid file type. Only CSV and Excel files are allowed.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');
    setUploadStatus('idle');

    try {
      const dataset = await dataApi.uploadFile(file);
      setUploadedDataset(dataset);
      setUploadStatus('success');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Upload failed';
      setError(errorMessage);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
    setUploadStatus('idle');
    setUploadedDataset(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Data File</h2>
            <p className="text-sm text-gray-600">
              Upload CSV or Excel files to analyze. Maximum file size: 10MB
            </p>
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500 mt-1">
                CSV, XLSX, XLS (MAX. 10MB)
              </span>
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === 'success' && uploadedDataset && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <div>
                  <p className="font-medium">File uploaded successfully!</p>
                  <p className="text-sm">
                    {uploadedDataset.rowCount} rows, {uploadedDataset.columnCount} columns
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            isLoading={isUploading}
            variant="primary"
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </Card>

      {/* Upload Instructions */}
      <Card title="File Format Requirements">
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• CSV files: Comma-separated values with header row</li>
          <li>• Excel files: .xlsx or .xls format</li>
          <li>• First row should contain column headers</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Supported data types: text, numbers, dates</li>
        </ul>
      </Card>
    </div>
  );
}

