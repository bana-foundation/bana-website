'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const partners = [
  { name: 'BD Ventures', logo: '/images/bd_ventures.jpeg' },
  { name: 'M2M Capital', logo: '/images/m2m_capital.jpeg' },
];

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#05225c] pt-28 text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,34,92,0.26)_0%,rgba(40,96,210,0.18)_100%)]" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 18, 0], opacity: [0.4, 0.68, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[-12%] h-[38rem] w-[74rem] -translate-x-1/2 rounded-[50%] blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(94, 179, 255, 0.62) 0%, rgba(94, 179, 255, 0.22) 34%, rgba(94, 179, 255, 0) 74%)',
          }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.24, 0.4, 0.24] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-0 top-[16%] h-[30rem] blur-3xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(75, 155, 255, 0.24) 46%, rgba(255,255,255,0) 100%)',
          }}
        />
        <div
          className="absolute inset-x-[8%] top-[12%] h-[30rem] rounded-[3rem] opacity-70"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0) 100%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0))',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0))',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#2860d2]" />
        <div className="absolute inset-x-[10%] top-[8%] h-[22rem] rounded-[3rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))] opacity-80 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto flex flex-1 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-sm font-semibold uppercase tracking-[0.35em] text-white/62"
          >
            {t('hero.eyebrow')}
          </motion.p>

          <div className="mt-5 overflow-hidden">
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: '110%', rotateX: -14 },
                show: {
                  opacity: 1,
                  y: '0%',
                  rotateX: 0,
                  transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-white will-change-transform sm:text-6xl lg:text-[104px]"
              style={{ transformOrigin: '50% 100%' }}
            >
              {t('hero.title')}
            </motion.h1>
          </div>

          <div className="mt-6 overflow-hidden">
            <motion.p
              variants={{
                hidden: { opacity: 0, y: '110%' },
                show: {
                  opacity: 1,
                  y: '0%',
                  transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="max-w-5xl text-balance text-[2rem] font-semibold leading-[1.18] tracking-[-0.022em] text-white sm:text-[2.5rem] lg:text-[3.4rem]"
            >
              {t('hero.headingPrefix')}
              <span className="text-gradient-blue"> {t('hero.headingAccent')}</span>
            </motion.p>
          </div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="mt-6 max-w-2xl text-balance text-lg font-medium leading-relaxed text-white/74 sm:text-xl"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="https://bana.gitbook.io/bana-docs"
              target="_blank"
              rel="noreferrer"
              className="btn-apple-blue group"
            >
              {t('hero.ctaPrimary')}
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#core-value"
              className="inline-flex items-center justify-center rounded-full bg-white/12 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_18px_38px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-px hover:bg-white/18"
            >
              {t('hero.ctaSecondary')}
            </a>
            <Link
              href="/attest"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-6 py-3 text-[15px] font-semibold text-violet-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-px hover:bg-violet-500/25"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Health Proof
            </Link>
          </motion.div>

        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2.5 py-3 px-4 sm:px-6 lg:px-8">
          <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-white/35">
            VC
          </span>
          <div className="flex items-center gap-5 sm:gap-10">
            {partners.map((partner, i) => (
              <div key={partner.name} className="flex items-center gap-5 sm:gap-10">
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/20 sm:h-14 sm:w-14">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="whitespace-nowrap text-sm font-medium text-white/70 sm:text-base">{partner.name}</span>
                </div>
                {i < partners.length - 1 && <div className="h-5 w-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
