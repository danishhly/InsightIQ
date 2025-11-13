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
        className={`w-full h-10 px-4 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-red-500' : ''
        } ${className}`}
        style={{
          backgroundColor: 'hsl(220, 20%, 14%)',
          borderColor: error ? 'hsl(0, 84%, 60%)' : 'hsl(220, 20%, 18%)',
          color: 'hsl(210, 40%, 98%)',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = 'hsl(199, 89%, 48%)';
            e.target.style.boxShadow = '0 0 0 2px hsl(199, 89%, 48% / 0.2)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'hsl(0, 84%, 60%)' : 'hsl(220, 20%, 18%)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
