'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-20%' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

export default function RoadmapSection() {
  const { t } = useTranslation();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.75', 'end 0.3'],
  });
  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.35,
  });
  const phases = t('roadmap.phases', { returnObjects: true }) as Array<{
    title: string;
    period: string;
    items: Array<{ label: string; text: string }>;
  }>;

  return (
    <section id="roadmap" className="relative overflow-hidden border-y border-gray-100 bg-white py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-[-8%] top-[-16%] h-[34rem] bg-[radial-gradient(circle_at_top,rgba(32,130,255,0.16),rgba(32,130,255,0.08)_28%,transparent_72%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-50/70 via-white/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="mb-20 text-center md:mb-28">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--bana-accent-blue)] shadow-[0_10px_24px_rgba(44,110,189,0.06)]">
            {t('roadmap.badge')}
          </div>
          <h3 className="mt-6 text-3xl font-semibold tracking-tighter text-gray-900 md:text-[3.5rem]">
            {t('roadmap.title')}
          </h3>
          <p className="mt-4 text-lg font-medium text-gray-500 md:text-xl">
            {t('roadmap.description')}
          </p>
        </motion.div>

        <div ref={timelineRef} className="relative flex flex-col gap-20 md:gap-36">
          <div className="absolute bottom-4 left-10 top-4 w-[2px] -translate-x-1/2 rounded-full bg-gray-100 md:left-1/2" />
          <motion.div
            style={{ scaleY: lineScaleY, height: 'calc(100% - 2rem)' }}
            className="absolute left-10 top-4 z-0 w-[4px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[#7ed0ff] via-[#2082ff] to-[#1a56db] shadow-[0_0_22px_rgba(32,130,255,0.32)] md:left-1/2"
          />

          {phases.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex w-full items-center justify-center"
            >
              <div className={`hidden w-full items-center md:flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex w-1/2 ${i % 2 === 0 ? 'justify-end pr-16' : 'justify-start pl-16'}`}>
                  <motion.div
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    initial={{ opacity: 0, x: i % 2 === 0 ? 28 : -28, y: 12 }}
                    viewport={{ once: true, margin: '-20%' }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, boxShadow: '0 26px 60px rgba(44,110,189,0.12)' }}
                    className={`max-w-md rounded-[2rem] border border-blue-50 bg-white/95 px-8 py-7 shadow-[0_18px_40px_rgba(44,110,189,0.08)] backdrop-blur-sm ${i % 2 === 0 ? 'text-right' : 'text-left'}`}
                  >
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--bana-accent-blue)]">
                      {t('roadmap.phaseLabel')} {i + 1} · {step.period}
                    </p>
                    <h4 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                      {step.title}
                    </h4>
                    <ul className={`space-y-4 ${i % 2 === 0 ? 'ml-auto' : ''}`}>
                      {step.items.map((item) => (
                        <li
                          key={item.label}
                          className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                          <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-[var(--bana-accent-blue)] shadow-[0_0_0_6px_rgba(32,130,255,0.08)]" />
                          <div>
                            <p className="text-base font-semibold text-gray-900 lg:text-lg">{item.label}</p>
                            <p className="mt-1 text-[15px] font-light leading-relaxed text-gray-500 lg:text-[17px]">
                              {item.text}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                <div className="w-1/2" />
              </div>

              <div className="absolute left-10 z-10 box-content -translate-x-1/2 bg-white p-2 md:left-1/2">
                <motion.div
                  whileInView={{
                    scale: [0.9, 1.06, 1],
                    backgroundColor: ['#0f172a', '#2082ff', '#0f172a'],
                    boxShadow: [
                      '0 14px 34px rgba(15,23,42,0.12)',
                      '0 18px 40px rgba(32,130,255,0.22)',
                      '0 14px 34px rgba(15,23,42,0.12)',
                    ],
                  }}
                  transition={{ duration: 1.05, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: '-20%' }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white shadow-[0_14px_34px_rgba(15,23,42,0.12)] ring-4 ring-white md:h-20 md:w-20 md:text-3xl"
                >
                  {i + 1}
                </motion.div>
              </div>

              <div className="flex w-full py-4 pl-28 pr-6 md:hidden">
                <motion.div
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  initial={{ opacity: 0, x: 16, y: 12 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[1.75rem] border border-blue-50 bg-white/95 px-6 py-5 shadow-[0_14px_30px_rgba(44,110,189,0.06)] backdrop-blur-sm"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--bana-accent-blue)]">
                    {t('roadmap.phaseLabel')} {i + 1} · {step.period}
                  </p>
                  <h4 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900">
                    {step.title}
                  </h4>
                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li key={item.label} className="flex gap-3">
                        <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-[var(--bana-accent-blue)] shadow-[0_0_0_6px_rgba(32,130,255,0.08)]" />
                        <div>
                          <p className="text-[15px] font-semibold text-gray-900">{item.label}</p>
                          <p className="mt-1 text-sm font-light leading-relaxed text-gray-500">{item.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
