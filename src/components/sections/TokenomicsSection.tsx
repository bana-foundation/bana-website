'use client';

import { motion } from 'framer-motion';
import { Coins, Gauge, Globe, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const INFRA_STRENGTHS = [
  {
    icon: Gauge,
    soft: 'bg-blue-50',
    tint: 'text-blue-700',
  },
  {
    icon: Wallet,
    soft: 'bg-indigo-50',
    tint: 'text-indigo-700',
  },
  {
    icon: Globe,
    soft: 'bg-cyan-50',
    tint: 'text-cyan-700',
  },
] as const;

export default function TokenomicsSection() {
  const { t } = useTranslation();
  const specifications = t('tokenomics.specifications', { returnObjects: true }) as Array<{ label: string; value: string }>;
  const infraStrengths = t('tokenomics.infra', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <section
      id="tokenomics"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfeff_0%,#f5f9ff_42%,#eef5ff_100%)] py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.04, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[4%] h-[24rem] w-[70rem] -translate-x-1/2 rounded-[50%] blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(109, 184, 255, 0.2) 0%, rgba(109, 184, 255, 0.08) 38%, rgba(109, 184, 255, 0) 74%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--bana-text-secondary)] shadow-[0_16px_34px_rgba(44,110,189,0.08)] backdrop-blur-xl">
            {t('tokenomics.badge')}
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.34em] text-[var(--bana-text-secondary)]">
            {t('tokenomics.eyebrow')}
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.06em] text-[var(--bana-text-primary)] sm:text-5xl lg:text-[4.4rem]">
            <span className="text-gradient-blue">{t('tokenomics.titleAccent')}</span> {t('tokenomics.titleSuffix')}
          </h2>
          <p className="mx-auto mt-6 max-w-5xl text-balance text-lg font-medium leading-relaxed text-[var(--bana-text-secondary)] sm:text-[1.65rem] sm:leading-[1.5]">
            {t('tokenomics.descriptionPrefix')}
            <span className="text-gradient-blue font-semibold"> {t('tokenomics.descriptionAccent')}</span>{t('tokenomics.descriptionSuffix')}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <div className="relative flex h-[420px] w-[420px] items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.55)_0%,rgba(37,99,235,0.14)_38%,rgba(37,99,235,0)_68%)] blur-2xl" />
              <div className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full bg-[#07111f] shadow-[0_32px_70px_rgba(37,99,235,0.24)] ring-[3px] ring-[#1d4ed8]">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/8">
                    <Coins className="h-10 w-10 text-[#60a5fa]" />
                  </div>
                  <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.28em] text-white/58">{t('tokenomics.logoSpace')}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                    BANA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.14, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2.8rem] border border-white/80 bg-white/88 p-8 shadow-[0_28px_70px_rgba(44,110,189,0.1)] backdrop-blur-2xl sm:p-10"
          >
            <div className="overflow-hidden rounded-[2rem] border border-[rgba(32,130,255,0.08)] bg-white shadow-[0_12px_28px_rgba(44,110,189,0.06)]">
              <div className="px-6 py-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
                  {t('tokenomics.cardEyebrow')}
                </p>
                <p className="mt-4 text-[16px] font-medium leading-relaxed text-[var(--bana-text-secondary)] sm:text-[1.05rem]">
                  {t('tokenomics.cardDescription')}
                </p>
              </div>
              {specifications.map((spec, index) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.55 }}
                  className={`grid gap-2 px-6 py-5 sm:grid-cols-[0.34fr_0.66fr] sm:items-center ${index !== specifications.length - 1 ? 'border-b border-[rgba(32,130,255,0.06)]' : ''
                    }`}
                >
                  <p className="text-[14px] font-semibold text-[var(--bana-text-secondary)]">
                    {spec.label}
                  </p>
                  <p className="text-right text-[15px] font-semibold text-[var(--bana-text-primary)] sm:text-[16px]">
                    {spec.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {INFRA_STRENGTHS.map((style, index) => {
            const item = infraStrengths[index];

            return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.12 + index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] border border-white/80 bg-white/86 p-7 shadow-[0_22px_52px_rgba(44,110,189,0.1)]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] ${style.soft}`}>
                <style.icon className={`h-5 w-5 ${style.tint}`} />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
                {t('tokenomics.infraLabel')}
              </p>
              <h4 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--bana-text-primary)]">
                {item.title}
              </h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--bana-text-secondary)]">
                {item.desc}
              </p>
            </motion.article>
          )})}
        </div>
      </div>
    </section>
  );
}
