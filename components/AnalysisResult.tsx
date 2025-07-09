import React from 'react';
import { useLanguage } from '../contexts/AppContext';

interface AnalysisResultProps {
  analysis: string;
  isLoading: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, isLoading }) => {
  const { t } = useLanguage();

  if (!analysis && !isLoading) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('yourReflection')}:</h2>
      <div className="p-4 bg-indigo-50/70 dark:bg-gray-900/50 border border-indigo-200 dark:border-gray-700 rounded-lg min-h-[100px]">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-300 dark:bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-slate-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-slate-300 dark:bg-gray-600 rounded w-4/6"></div>
          </div>
        ) : (
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
        )}
      </div>
    </div>
  );
};