'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AnnouncementBanner() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center bg-[#f5a623] px-4 text-[#0a0b0d]">
      <Link
        href="/swap"
        className="flex items-center gap-2 text-[13px] font-semibold hover:underline underline-offset-2"
      >
        <span className="hidden sm:inline">{t('announcement.long')}</span>
        <span className="sm:hidden">{t('announcement.short')}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#0a0b0d] px-2.5 py-0.5 text-[11px] font-bold text-[#f5a623]">
          {t('announcement.cta')}
        </span>
      </Link>
      <button
        onClick={() => setDismissed(true)}
        aria-label="닫기"
        className="absolute right-3 rounded-full p-1 hover:bg-black/10 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
