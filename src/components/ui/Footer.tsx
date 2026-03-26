'use client';

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="section-wash relative overflow-hidden text-[var(--bana-text-primary)]">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-[13px] font-medium text-[var(--bana-text-secondary)]">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
