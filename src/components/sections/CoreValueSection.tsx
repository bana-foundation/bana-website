'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  BadgeCheck,
  Building,
  Coins,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';

const INNOVATION_ICONS = {
  '01': ShieldCheck,
  '02': Coins,
  '03': GitBranch,
} as const;

const ECO_ICONS = {
  Asset: Building,
  Profit: BadgeCheck,
  Value: Coins,
  Growth: ArrowRight,
} as const;

const introStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
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

export default function CoreValueSection() {
  const { t } = useTranslation();
  const innovations = useMemo(
    () =>
      t('coreValue.innovations', { returnObjects: true }) as Array<{
        id: keyof typeof INNOVATION_ICONS;
        eyebrow: string;
        title: string;
        summary: string;
        points: Array<{ label: string; text: string }>;
      }>,
    [t],
  );
  const ecoCycle = useMemo(
    () =>
      t('coreValue.ecoCycle.steps', { returnObjects: true }) as Array<{
        key: keyof typeof ECO_ICONS;
        title: string;
      }>,
    [t],
  );

  return (
    <section
      id="core-value"
      className="relative overflow-hidden bg-[#f5f7fb] py-28 sm:py-36"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(84,140,255,0.10),transparent_30%),linear-gradient(180deg,#fbfcfe_0%,#f5f7fb_45%,#eff3f9_100%)]" />

        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[-10rem] h-[28rem] w-[54rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(125,170,255,0.22) 0%, rgba(125,170,255,0.08) 38%, rgba(125,170,255,0) 72%)',
          }}
        />

        <div className="absolute left-1/2 top-[18%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={introStagger}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.div variants={introItem} className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b7280] shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            {t('coreValue.badge')}
          </motion.div>

          <motion.p variants={introItem} className="mt-6 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#7b8494]">
            {t('coreValue.eyebrow')}
          </motion.p>

          <motion.h2 variants={introItem} className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] text-[#111827] sm:text-5xl lg:text-[4rem] lg:leading-[1.05]">
            {t('coreValue.titlePrefix')}
            <span className="bg-[linear-gradient(180deg,#2563eb_0%,#60a5fa_100%)] bg-clip-text text-transparent">
              {' '}{t('coreValue.titleAccent')}
            </span>
          </motion.h2>

          <motion.p variants={introItem} className="mx-auto mt-6 max-w-3xl text-balance text-[17px] font-medium leading-relaxed text-[#6b7280] sm:text-[20px]">
            {t('coreValue.description')}
          </motion.p>
        </motion.div>

        {/* Innovation Cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {innovations.map((item, index) => {
            const Icon = INNOVATION_ICONS[item.id];

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/72 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-10"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#93c5fd] to-transparent opacity-80" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.18)_100%)]" />

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/80 bg-[#f7faff] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_14px_rgba(37,99,235,0.08)]">
                    <Icon className="h-5 w-5 text-[#2563eb]" strokeWidth={2} />
                  </div>

                  <div className="mt-12">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.30em] text-[#7b8494]">
                      {item.eyebrow}
                    </p>

                    <h3 className="mt-4 text-[30px] font-semibold tracking-[-0.03em] text-[#111827]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-[16px] leading-relaxed text-[#4b5563]">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-10 space-y-7 border-t border-[#e9eef7] pt-7">
                    {item.points.map((point) => (
                      <div key={point.label}>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2563eb]">
                          {point.label}
                        </p>
                        <p className="mt-2 text-[15px] leading-relaxed text-[#6b7280]">
                          {point.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Eco Cycle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.15, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 overflow-hidden rounded-[36px] border border-white/70 bg-white/68 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-10 lg:p-12"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.65),rgba(255,255,255,0.28))]" />
          <div className="absolute right-[-8rem] top-[-8rem] h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-[-5rem] h-52 w-52 rounded-full bg-sky-100/50 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[#7b8494]">
                {t('coreValue.ecoCycle.eyebrow')}
              </p>

              <h3 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#111827] sm:text-4xl lg:text-[2.8rem]">
                {t('coreValue.ecoCycle.title')}
              </h3>

              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#6b7280]">
                {t('coreValue.ecoCycle.description')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {ecoCycle.map((step, index) => {
                const Icon = ECO_ICONS[step.key];

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.24 + index * 0.08, duration: 0.7 }}
                    className="rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/80 bg-[#f7faff] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_14px_rgba(37,99,235,0.08)]">
                      <Icon className="h-5 w-5 text-[#2563eb]" strokeWidth={2} />
                    </div>

                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8494]">
                      {step.key}
                    </p>

                    <p className="mt-2 text-[16px] font-semibold leading-relaxed tracking-[-0.02em] text-[#111827]">
                      {step.title}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
