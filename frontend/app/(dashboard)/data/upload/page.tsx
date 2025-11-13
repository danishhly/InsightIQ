'use client';

import { DataUpload } from '@/components/dashboard/DataUpload';

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="text-gray-600 mt-1">Upload your CSV or Excel files to get started</p>
      </div>
      <DataUpload />
    </div>
  );
}

