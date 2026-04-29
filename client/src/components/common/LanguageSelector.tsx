import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Force initial language if not set
  if (!i18n.language || !['en', 'es'].includes(i18n.language)) {
    i18n.changeLanguage('en');
  }

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      title={`Switch to ${i18n.language === 'en' ? 'Spanish' : 'English'}`}
    >
      <Globe size={16} />
      <span className="uppercase font-bold">
        {i18n.language === 'en' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSelector;