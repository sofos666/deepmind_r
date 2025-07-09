import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeImage } from './services/geminiService';
import { LogoIcon, SparklesIcon, ChangeIcon, SunIcon, MoonIcon, SpainFlagIcon, UsaFlagIcon } from './components/icons';
import { useLanguage, useTheme } from './contexts/AppContext';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('hasVisitedDeepMind');
    if (isFirstVisit) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedDeepMind', 'true');
      const timer = setTimeout(() => {
        setShowOnboarding(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setAnalysis('');
      setError('');
    }
  };

  const handleAnalysis = useCallback(async () => {
    if (!imageFile) {
      setError(t('errorSelectImage'));
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis('');

    try {
      const prompt = t('geminiPrompt');
      const result = await analyzeImage(imageFile, prompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('errorUnknown');
      setError(`${t('errorAnalysis')}: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, t]);
  
  const handleReset = () => {
      setImageFile(null);
      setImageUrl(null);
      setAnalysis('');
      setError('');
      setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-500"/>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {t('appName')}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 relative">
                <button onClick={() => setLanguage('en')} className={`p-1.5 rounded-full ${language === 'en' ? 'bg-indigo-100 dark:bg-gray-700' : 'hover:bg-slate-200 dark:hover:bg-gray-700'}`} aria-label="Switch to English">
                    <UsaFlagIcon className="h-6 w-6"/>
                </button>
                <button onClick={() => setLanguage('es')} className={`p-1.5 rounded-full ${language === 'es' ? 'bg-indigo-100 dark:bg-gray-700' : 'hover:bg-slate-200 dark:hover:bg-gray-700'}`} aria-label="Cambiar a Español">
                    <SpainFlagIcon className="h-6 w-6"/>
                </button>
                {showOnboarding && (
                    <div className="absolute top-full right-0 mt-2 animate-tooltip">
                        <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                            Español
                            <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-slate-800 dark:border-b-slate-200"></div>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700" aria-label="Toggle theme">
                {theme === 'light' ? <MoonIcon className="h-6 w-6 text-slate-600"/> : <SunIcon className="h-6 w-6 text-yellow-400"/>}
            </button>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto flex-grow">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80 dark:border-gray-700 transition-all">
          {!imageUrl ? (
             <>
                <div className="text-center mb-6">
                    <p className="text-lg text-slate-600 dark:text-slate-300">{t('tagline')}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('subTagline')}</p>
                </div>
                <ImageUploader onImageChange={handleImageChange} />
            </>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in">
                <div className="relative group">
                    <img src={imageUrl} alt="Preview" className="w-full h-auto max-h-[60vh] object-contain rounded-xl" />
                    <button 
                        onClick={handleReset}
                        className="absolute top-3 right-3 bg-white/70 dark:bg-gray-800/60 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-gray-700 p-2 rounded-full transition-all opacity-50 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={t('changeImage')}
                    >
                        <ChangeIcon className="w-5 h-5"/>
                    </button>
                </div>

                {!analysis && (
                     <button
                        onClick={handleAnalysis}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('analyzing')}
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5"/>
                                {t('generateReflection')}
                            </>
                        )}
                    </button>
                )}
             
              {error && <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 p-3 rounded-lg text-center">{error}</div>}
              
              <AnalysisResult analysis={analysis} isLoading={isLoading} />
            </div>
          )}
        </div>
      </main>

       <footer className="w-full max-w-4xl mx-auto text-center mt-10 text-sm text-slate-500 dark:text-slate-400 space-y-1">
        <p>{t('footerDisclaimer')}</p>
        <p>{t('footerAuthor')}</p>
        <p>&copy; {new Date().getFullYear()} DeepMind. {t('footerCopyright')}</p>
      </footer>
    </div>
  );
};

export default App;