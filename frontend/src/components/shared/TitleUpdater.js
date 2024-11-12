import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TitleUpdater = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update the document title whenever the language changes
    document.title = t('meta.title');
  }, [t, i18n.language]);

  return null; // This component doesn't render anything
};

export default TitleUpdater;
