'use client';

import { motion } from 'framer-motion';
import { BookCheck, Building2, Eye, Landmark, ShieldCheck, ShieldEllipsis, WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-15%' },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
};

const TECHNICAL_SECURITY = [
  {
    icon: ShieldCheck,
    title: '스마트 컨트랙트 감사 (Audit)',
    points: [
      {
        label: '글로벌 표준 준수',
        text: '세계 최고의 보안 감사 업체(CertiK 등)를 통해 코드 결함 및 취약점 점검을 완료하였습니다.',
      },
      {
        label: '상시 모니터링',
        text: '스카이넷(Skynet) 등 실시간 온체인 감시 시스템을 도입하여 비정상적인 트랜잭션을 즉각 탐지하고 차단합니다.',
      },
    ],
  },
  {
    icon: WalletCards,
    title: '멀티 시그 커스터디 (Multi-sig Custody)',
    points: [
      {
        label: '자산 분산 관리',
        text: '재단 및 주요 자산의 출금 권한은 다수의 독립된 검증인이 서명해야 하는 Multi-signature 지갑으로 관리됩니다.',
      },
      {
        label: '기관급 보안',
        text: 'Cobo 등 전문 커스터디 파트너와 협업하여 물리적, 논리적 해킹 위협으로부터 자산을 원천 보호합니다.',
      },
    ],
  },
] as const;

const OPERATIONAL_TRANSPARENCY = [
  {
    icon: Building2,
    title: '실물 자산 실사 (RWA Verification)',
    points: [
      {
        label: '외부 감사',
        text: '매 분기별 전문 회계 법인을 통해 실제 보유 자산(병원 시설, 부동산 등)과 온체인 기록의 일치 여부를 대조합니다.',
      },
      {
        label: '투명 공시',
        text: '감사 보고서는 커뮤니티에 전면 공개되어 누구나 프로젝트의 실체를 확인할 수 있습니다.',
      },
    ],
  },
  {
    icon: Eye,
    title: '실시간 수익 정산 시스템',
    points: [
      {
        label: '온체인 정산',
        text: '비즈니스 운영 수익이 생태계 보상으로 전환되는 전 과정은 블록체인 상에 기록되어 임의의 조작이 불가능합니다.',
      },
    ],
  },
] as const;

const RISK_MANAGEMENT = [
  {
    icon: Landmark,
    title: '가격 방어 펀드',
    text: '상장 후 유동성 보호를 위해 별도의 가치 방어 기금(Reserve Fund)을 상시 유지합니다.',
  },
  {
    icon: BookCheck,
    title: '법률 검토 (Legal Opinion)',
    text: '글로벌 규제 변화에 대응하기 위해 각 국가별 법률 자문팀을 운영하여 컴플라이언스를 준수합니다.',
  },
] as const;

function SecurityCard({
  icon: Icon,
  title,
  points,
}: {
  icon: typeof ShieldCheck;
  title: string;
  points: ReadonlyArray<{ label: string; text: string }>;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="rounded-[2rem] border border-blue-100/80 bg-white/96 p-8 shadow-[0_24px_60px_rgba(27,84,177,0.08)] backdrop-blur-sm"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(5,34,92,0.08),rgba(40,96,210,0.14))]">
          <Icon className="h-6 w-6 text-[var(--bana-accent-blue)]" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h3>
      </div>

      <div className="space-y-5">
        {points.map((point) => (
          <div key={point.label} className="rounded-[1.4rem] bg-slate-50/85 px-5 py-4">
            <p className="text-sm font-semibold text-gray-900">{point.label}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{point.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SecuritySection() {
  const { t } = useTranslation();
  const technical = t('security.technical', { returnObjects: true }) as Array<{
    title: string;
    points: Array<{ label: string; text: string }>;
  }>;
  const transparency = t('security.transparency', { returnObjects: true }) as Array<{
    title: string;
    points: Array<{ label: string; text: string }>;
  }>;
  const riskItems = t('security.risk.items', { returnObjects: true }) as Array<{ title: string; text: string }>;

  return (
    <section id="security" className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_24%,#f7fbff_100%)] py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-[-8%] top-[-8%] h-[24rem] bg-[radial-gradient(circle_at_top,rgba(40,96,210,0.12),transparent_72%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-6%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(40,96,210,0.12),transparent_72%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mx-auto mb-18 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bana-accent-blue)] shadow-[0_12px_24px_rgba(27,84,177,0.06)]">
            <ShieldEllipsis className="h-4 w-4" />
            {t('security.badge')}
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 md:text-[3.4rem]">
            {t('security.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-[19px]">
            {t('security.description1')}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-500 md:text-lg">
            {t('security.description2')}
          </p>
        </motion.div>

        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="rounded-[2.2rem] border border-blue-100/80 bg-[linear-gradient(180deg,rgba(5,34,92,0.98),rgba(40,96,210,0.92))] p-8 text-white shadow-[0_28px_70px_rgba(5,34,92,0.28)]"
          >
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/14">
                <ShieldCheck className="h-6 w-6 text-blue-100" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/80">{t('security.technicalCard.eyebrow')}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{t('security.technicalCard.title')}</h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] bg-white/10 px-5 py-5 ring-1 ring-white/12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100/70">{t('security.technicalCard.boxes.0.eyebrow')}</p>
                <p className="mt-3 text-xl font-semibold">{t('security.technicalCard.boxes.0.title')}</p>
                <p className="mt-2 text-sm leading-relaxed text-blue-50/88">
                  {t('security.technicalCard.boxes.0.desc')}
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-white/10 px-5 py-5 ring-1 ring-white/12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100/70">{t('security.technicalCard.boxes.1.eyebrow')}</p>
                <p className="mt-3 text-xl font-semibold">{t('security.technicalCard.boxes.1.title')}</p>
                <p className="mt-2 text-sm leading-relaxed text-blue-50/88">
                  {t('security.technicalCard.boxes.1.desc')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.92, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2.2rem] border border-blue-100/80 bg-white/96 p-8 shadow-[0_24px_60px_rgba(27,84,177,0.08)]"
          >
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bana-accent-blue)]">
                {t('security.transparencyCard.eyebrow')}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{t('security.transparencyCard.title')}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                {t('security.transparencyCard.desc')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.6rem] bg-blue-50/70 px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">{t('security.transparencyCard.boxes.0.title')}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                  {t('security.transparencyCard.boxes.0.desc')}
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-slate-50 px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">{t('security.transparencyCard.boxes.1.title')}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                  {t('security.transparencyCard.boxes.1.desc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {TECHNICAL_SECURITY.map((item, index) => (
            <SecurityCard key={item.title} icon={item.icon} title={technical[index].title} points={technical[index].points} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {OPERATIONAL_TRANSPARENCY.map((item, index) => (
            <SecurityCard key={item.title} icon={item.icon} title={transparency[index].title} points={transparency[index].points} />
          ))}
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.92, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 rounded-[2.2rem] border border-blue-100/80 bg-white/96 p-8 shadow-[0_24px_60px_rgba(27,84,177,0.08)]"
          >
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bana-accent-blue)]">
              {t('security.risk.eyebrow')}
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{t('security.risk.title')}</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {RISK_MANAGEMENT.map((item, index) => (
              <div key={item.title} className="rounded-[1.6rem] bg-slate-50/90 px-6 py-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(5,34,92,0.08),rgba(40,96,210,0.14))]">
                  <item.icon className="h-5 w-5 text-[var(--bana-accent-blue)]" />
                </div>
                <p className="text-lg font-semibold tracking-tight text-gray-900">{riskItems[index].title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{riskItems[index].text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-blue-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,248,255,0.96))] px-8 py-8 text-center shadow-[0_24px_60px_rgba(27,84,177,0.08)]"
        >
          <p className="text-lg leading-relaxed text-gray-700 md:text-[19px]">
            {t('security.closing')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
