import { useTranslation } from 'react-i18next';

export default function RegisterGuaraWhatCover() {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#1A1B16] mb-6">
          {t('navigation.whatCover')}
        </h1>
        <p className="text-gray-700 max-w-3xl">
          {/* Placeholder content. Expand with actual coverage details. */}
          {t('guGuarantee.description')}
        </p>
      </div>
    </section>
  );
}
