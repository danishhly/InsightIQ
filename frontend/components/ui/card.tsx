import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-xl border backdrop-blur-xl shadow-2xl ${className}`}
      style={{
        backgroundColor: 'hsl(220, 20%, 10%)',
        borderColor: 'hsl(220, 20%, 18%)',
        boxShadow: '0 8px 32px hsl(220, 26%, 0% / 0.4)'
      }}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-8 pb-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl font-bold ${className}`} style={{ color: 'hsl(210, 40%, 98%)' }}>
      {children}
    </h2>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm mt-1 ${className}`} style={{ color: 'hsl(215, 20%, 65%)' }}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-8 pb-8 ${className}`}>
      {children}
    </div>
  );
};
