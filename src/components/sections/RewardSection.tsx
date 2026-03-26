'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, Lock, TimerReset, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ALLOCATION = [
  { name: 'Ecosystem & Rewards', pct: 45, amount: '4.5억 BANA', desc: '생태계 기여 보상 및 스테이킹 유동성', color: '#2082ff' },
  { name: 'Foundation & Team', pct: 20, amount: '2억 BANA', desc: '기술 개발 및 운영 (강력 락업 적용)', color: '#22c55e' },
  { name: 'Token Sale', pct: 15, amount: '1.5억 BANA', desc: '단계별 세일 물량 (Phase 1 ~ 4)', color: '#facc15' },
  { name: 'Marketing & Partnership', pct: 15, amount: '1.5억 BANA', desc: '글로벌 브랜딩 및 파트너십 확장', color: '#ef4444' },
  { name: 'Liquidity Pool', pct: 5, amount: '0.5억 BANA', desc: '거래소 상장 및 시장 안정성 확보', color: '#a855f7' },
] as const;

const STRATEGIES = [
  {
    title: '초기 유통 최소화',
    subtitle: 'Initial Supply Control',
    desc: '상장 초기 시장에 풀리는 유통량을 전체 발행량의 10% 미만으로 엄격히 억제합니다.',
    effect: '초기 공급 과잉에 따른 급격한 가격 변동성을 차단해 안정적인 차트 형성을 유도합니다.',
    icon: TimerReset,
    soft: 'bg-blue-50',
    tint: 'text-blue-700',
  },
  {
    title: '재단의 책임 경영',
    subtitle: '3-Year Lock-up',
    desc: '재단 및 팀 보유 물량에 대해 3년(36개월)의 강력한 락업 기간을 설정했습니다.',
    effect: '단기 차익이 아닌 장기 완수에 대한 강한 의지와 책임감을 증명합니다.',
    icon: Lock,
    soft: 'bg-emerald-50',
    tint: 'text-emerald-700',
  },
  {
    title: '실물 수익 기반 가치 연동',
    subtitle: 'Deflationary Burn',
    desc: 'Vesting 물량보다 큰 규모의 실물 수익을 투입해 시장가 매수 및 소각을 병행합니다.',
    effect: '유통량은 줄어들고 내재 가치는 높아지는 디플레이션 모델을 지지합니다.',
    icon: TrendingDown,
    soft: 'bg-indigo-50',
    tint: 'text-indigo-700',
  },
] as const;

export default function RewardSection() {
  const { t } = useTranslation();
  const [animatedSupply, setAnimatedSupply] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const isInView = useInView(sectionRef, { amount: 0.12 });
  const size = 300;
  const strokeWidth = 42;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalSupply = 1_000_000_000;
  const allocationText = t('reward.allocation', { returnObjects: true }) as Array<{
    name: string;
    pct: number;
    amount: string;
    desc: string;
  }>;
  const policyRows = t('reward.policyRows', { returnObjects: true }) as string[][];
  const strategiesText = t('reward.strategies', { returnObjects: true }) as Array<{
    title: string;
    subtitle: string;
    desc: string;
    effect: string;
  }>;

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    const duration = 1600;
    const startedAt = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedSupply(Math.floor(totalSupply * progress));

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView]);

  const segments = ALLOCATION.reduce<Array<(typeof ALLOCATION)[number] & {
    dash: string;
    dashOffset: number;
  }>>((acc, item, index) => {
    const previousOffset = acc.length
      ? Math.abs(acc[acc.length - 1].dashOffset) + (ALLOCATION[index - 1].pct / 100) * circumference
      : 0;

    acc.push({
      ...item,
      dash: `${(item.pct / 100) * circumference} ${circumference}`,
      dashOffset: -previousOffset,
    });

    return acc;
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reward"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfeff_0%,#f4f9ff_40%,#edf5ff_100%)] py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.04, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[4%] h-[24rem] w-[72rem] -translate-x-1/2 rounded-[50%] blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(107, 184, 255, 0.18) 0%, rgba(107, 184, 255, 0.08) 38%, rgba(107, 184, 255, 0) 74%)',
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
            {t('reward.badge')}
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.34em] text-[var(--bana-text-secondary)]">
            {t('reward.eyebrow')}
          </p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="mt-5 flex items-end justify-center gap-3 text-balance"
          >
            <span className="text-4xl font-semibold tracking-[-0.06em] text-[var(--bana-text-primary)] sm:text-5xl lg:text-[4.5rem]">
              {animatedSupply.toLocaleString('en-US')}
            </span>
            <span className="text-gradient-blue mb-1 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl lg:text-[2rem]">
              {t('reward.supplyLabel')}
            </span>
          </motion.p>
          <p className="mx-auto mt-6 max-w-3xl text-balance text-lg font-medium leading-relaxed text-[var(--bana-text-secondary)] sm:text-xl">
            {t('reward.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 rounded-[2.8rem] border border-white/80 bg-white/88 p-8 shadow-[0_28px_70px_rgba(44,110,189,0.12)] backdrop-blur-2xl sm:p-10"
        >
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--bana-accent-blue)]">
              {t('reward.supplyBadge')}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
              {t('reward.chartEyebrow')}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--bana-text-primary)]">
              {t('reward.chartTitle')}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--bana-text-secondary)]">
              {t('reward.chartDescription')}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full bg-white shadow-[0_20px_44px_rgba(44,110,189,0.08)]">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {segments.map((segment, index) => (
                  <motion.circle
                    key={segment.name}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={segment.dash}
                    strokeDashoffset={segment.dashOffset}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    whileInView={{ strokeDasharray: segment.dash }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--bana-text-secondary)]">
                  {t('reward.totalSupplyLabel')}
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-[var(--bana-text-primary)]">
                  {t('reward.totalSupplyValue')}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--bana-text-secondary)]">
                  {t('reward.totalSupplyCaption')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex h-full flex-col rounded-[2rem] bg-[rgba(240,247,255,0.85)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-blue-50">
                  <BarChart3 className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
                    {t('reward.detailEyebrow')}
                  </p>
                  <p className="mt-1 text-sm text-[var(--bana-text-secondary)]">
                    {t('reward.detailTitle')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {ALLOCATION.map((item, index) => {
                  const itemText = allocationText[index];

                  return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.55 }}
                    className="flex items-start gap-3 rounded-[1.35rem] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(44,110,189,0.06)]"
                  >
                    <span
                      className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[var(--bana-text-primary)]">
                        {itemText.name} ({itemText.pct}%)
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--bana-text-secondary)]">
                        {itemText.desc}
                      </p>
                    </div>
                  </motion.div>
                )})}
              </div>
            </div>

            <div className="flex h-full flex-col rounded-[2rem] bg-[rgba(240,247,255,0.85)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-indigo-50">
                  <BarChart3 className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
                    {t('reward.policyEyebrow')}
                  </p>
                  <p className="mt-1 text-sm text-[var(--bana-text-secondary)]">
                    {t('reward.policyTitle')}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {policyRows.map((row, index) => (
                  <motion.div
                    key={row[0]}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.5 }}
                    className="rounded-[1.8rem] border border-[rgba(32,130,255,0.08)] bg-white p-5 shadow-[0_12px_28px_rgba(44,110,189,0.06)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[14px] font-semibold text-[var(--bana-text-primary)]">{row[0]}</p>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[var(--bana-accent-blue)]">
                        {row[1]}
                      </span>
                    </div>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--bana-text-secondary)]">
                      {t('reward.amountLabel')}
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-[var(--bana-text-primary)]">{row[2]}</p>
                    <p className="mt-4 text-[13px] leading-relaxed text-[var(--bana-text-secondary)]">{row[3]}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.16, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 rounded-[2.6rem] border border-white/80 bg-white/86 p-6 shadow-[0_28px_70px_rgba(44,110,189,0.1)] sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-cyan-50">
              <Lock className="h-5 w-5 text-cyan-700" />
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
                {t('reward.lockupEyebrow')}
              </p>
              <p className="mt-1 text-sm text-[var(--bana-text-secondary)]">
                {t('reward.lockupTitle')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.8rem] border border-[rgba(32,130,255,0.08)] bg-white p-5 shadow-[0_12px_28px_rgba(44,110,189,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--bana-text-primary)]">
                    {t('reward.lockups.foundation.title')}
                  </p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.22em] text-[var(--bana-text-secondary)]">
                    {t('reward.lockups.foundation.subtitle')}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--bana-accent-blue)]">
                  {t('reward.lockups.foundation.badge')}
                </span>
              </div>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="w-full rounded-full bg-[linear-gradient(90deg,#2082ff,#7bc4ff)]" />
              </div>
              <p className="mt-3 text-[12px] font-semibold text-[var(--bana-text-primary)]">
                {t('reward.lockups.foundation.progressLabel')}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--bana-text-secondary)]">
                {t('reward.lockups.foundation.desc')}
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[rgba(32,130,255,0.08)] bg-white p-5 shadow-[0_12px_28px_rgba(44,110,189,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--bana-text-primary)]">
                    {t('reward.lockups.marketing.title')}
                  </p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.22em] text-[var(--bana-text-secondary)]">
                    {t('reward.lockups.marketing.subtitle')}
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                  {t('reward.lockups.marketing.badge')}
                </span>
              </div>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="w-[5%] rounded-full bg-[linear-gradient(90deg,#2082ff,#7bc4ff)]" />
              </div>
              <p className="mt-3 text-[12px] font-semibold text-[var(--bana-text-primary)]">
                {t('reward.lockups.marketing.progressLabel')}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--bana-text-secondary)]">
                {t('reward.lockups.marketing.desc')}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {STRATEGIES.map((item, index) => {
            const strategy = strategiesText[index];

            return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.14 + index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] border border-white/80 bg-white/86 p-7 shadow-[0_22px_52px_rgba(44,110,189,0.1)]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] ${item.soft}`}>
                <item.icon className={`h-5 w-5 ${item.tint}`} />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--bana-text-secondary)]">
                {strategy.subtitle}
              </p>
              <h4 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--bana-text-primary)]">
                {strategy.title}
              </h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--bana-text-secondary)]">
                {strategy.desc}
              </p>
              <p className="mt-4 text-[14px] font-medium leading-relaxed text-[var(--bana-text-primary)]">
                {t('reward.effectPrefix')}: {strategy.effect}
              </p>
            </motion.article>
          )})}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto mt-12 max-w-5xl text-center text-balance text-lg font-medium leading-relaxed text-[var(--bana-text-secondary)]"
        >
          {t('reward.closing')}
        </motion.p>
      </div>
    </section>
  );
}
