import React from 'react';
import { ServerCrash, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ في الخادم',
  description = 'تعذر إتمام الطلب حالياً. حاول مرة أخرى بعد قليل.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <div className="w-14 h-14 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center mb-4 border border-danger-200/60">
      <ServerCrash className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        type="button"
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        إعادة المحاولة
      </button>
    )}
  </div>
);

export default ErrorState;