'use client';

import { Card } from '@/components/ui/card';
import { User, Bot, Code } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sqlQuery?: string;
  result?: {
    columns: string[];
    rows: any[][];
    rowCount: number;
  };
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
          <Card className={`p-4 ${isUser ? 'bg-blue-50' : 'bg-white'}`}>
            <p className="text-gray-900">{message.content}</p>
            
            {message.sqlQuery && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Code className="w-4 h-4" />
                  <span className="font-medium">Generated SQL:</span>
                </div>
                <code className="block text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {message.sqlQuery}
                </code>
              </div>
            )}

            {message.result && message.result.rows && message.result.rows.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{message.result.rowCount} row(s)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        {message.result.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-2 text-left font-medium text-gray-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {message.result.rows.slice(0, 10).map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-t">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="px-3 py-2 text-gray-900">
                              {String(cell || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {message.result.rows.length > 10 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing first 10 of {message.result.rows.length} rows
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
          <p className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

