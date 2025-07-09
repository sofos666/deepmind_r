import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/AppContext';
import { UploadCloudIcon } from './icons';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0]);
    }
  }, [onImageChange]);


  return (
    <label
      htmlFor="image-upload"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        isDragging 
        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
        : 'border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <UploadCloudIcon className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-gray-400'}`} />
        <p className={`mb-2 text-lg font-semibold ${isDragging ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
          {t('uploaderClickOrDrag')}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('uploaderFormats')}</p>
      </div>
      <input
        id="image-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif, image/webp"
      />
    </label>
  );
};