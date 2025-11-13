import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#a0a0b0] mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 bg-[#0f0f23] border border-[#2a2a3e] rounded-lg text-white placeholder-[#a0a0b0] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
