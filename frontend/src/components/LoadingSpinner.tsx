import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
      {message && <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
