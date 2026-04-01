'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import baseI18n from '@/i18n/client';
import type { AppLanguage } from '@/i18n/resources';
import { LANGUAGE_COOKIE } from '@/i18n/constants';

const STORAGE_KEY = LANGUAGE_COOKIE;

export default function I18nProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: AppLanguage;
}) {
  const [ready, setReady] = useState(false);
  const [i18n] = useState(() => {
    const instance = baseI18n.cloneInstance({
      lng: initialLanguage,
      fallbackLng: 'en',
      initImmediate: false,
    });

    if (instance.language !== initialLanguage) {
      void instance.changeLanguage(initialLanguage);
    }

    return instance;
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    if (saved && saved !== i18n.language) {
      void i18n.changeLanguage(saved).finally(() => {
        queueMicrotask(() => setReady(true));
      });
      return;
    }

    queueMicrotask(() => setReady(true));
  }, [i18n]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng;
      window.localStorage.setItem(STORAGE_KEY, lng);
      document.cookie = `${LANGUAGE_COOKIE}=${lng}; path=/; max-age=31536000; samesite=lax`;
    };

    i18n.on('languageChanged', handleLanguageChanged);
    handleLanguageChanged(i18n.language);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  if (!ready) {
    return null;
  }

  return <I18nextProvider i18n={i18n} defaultNS="translation">{children}</I18nextProvider>;
}
