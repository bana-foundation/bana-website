'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PARTNER_LOGOS: Record<string, string> = {
  OrionX: '/images/orionx.jpeg',
  'AEGIS X': '/images/aegisx.jpeg',
  Ai6: '/images/ai6.jpeg',
  'Athena Protocol': '/images/athenaai.jpeg',
};

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
};

const introStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const introItem = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

export default function EcosystemSection() {
  const { t } = useTranslation();

  const partners = useMemo(
    () =>
      t('ecosystem.partners', { returnObjects: true }) as Array<{
        name: string;
        tagline: string;
        description: string;
      }>,
    [t],
  );

  return (
    <section id="ecosystem" className="section-wash relative overflow-hidden py-24 text-[var(--bana-text-primary)] sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={introStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-12%' }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <motion.span
            variants={introItem}
            className="mb-4 inline-block rounded-full border border-[#2082ff]/20 bg-[#2082ff]/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2082ff]"
          >
            {t('ecosystem.badge')}
          </motion.span>
          <motion.h2
            variants={introItem}
            className="text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-[var(--bana-text-primary)] sm:text-5xl"
          >
            {t('ecosystem.titlePrefix')}{' '}
            <span className="text-gradient-blue">{t('ecosystem.titleAccent')}</span>
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              {...fadeUp}
              transition={{ duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-2xl border border-[var(--bana-border)] bg-white/60 p-6 shadow-sm backdrop-blur-sm"
            >
              {/* Logo + Name */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--bana-border)]">
                  <Image
                    src={PARTNER_LOGOS[partner.name] ?? ''}
                    alt={partner.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-base font-semibold leading-tight text-[var(--bana-text-primary)]">
                  {partner.name}
                </span>
              </div>

              {/* Tagline */}
              <span className="mb-3 inline-block self-start rounded-full bg-[#2082ff]/10 px-3 py-1 text-[11px] font-semibold text-[#2082ff]">
                {partner.tagline}
              </span>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[var(--bana-text-secondary)]">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
