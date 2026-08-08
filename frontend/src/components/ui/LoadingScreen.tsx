import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, fullScreen = true }) => (
  <div className={`flex flex-col items-center justify-center p-6 text-center ${fullScreen ? 'min-h-screen bg-slate-50' : 'py-16'}`}>
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
    {message && <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>}
  </div>
);

export default LoadingScreen;