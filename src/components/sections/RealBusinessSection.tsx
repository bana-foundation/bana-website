'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Pause,
  Play,
  BatteryCharging,
  Building2,
  Clapperboard,
  Cpu,
  Globe2,
  GraduationCap,
  Hospital,
  Hotel,
  Landmark,
  Leaf,
  Megaphone,
  Package,
  Plane,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ROTATE_INTERVAL_MS = 5200;

type SectorMetric = {
  label: string;
  value: string;
};

type Sector = {
  id: string;
  name: string;
  title: string;
  desc: string;
  detail: string;
  icon: LucideIcon;
  color: string;
  image: string;
  thumb: string;
  points: string[];
  metrics: SectorMetric[];
};

const SECTORS: Sector[] = [
  {
    id: '01',
    name: 'Medical',
    title: '메디컬',
    desc: '성형, 안티에이징 클리닉 운영 및 의료 인프라 자산',
    detail:
      'BANA의 메인 포트폴리오입니다. 병원 운영 수익과 의료 인프라 자산을 중심으로 안정적인 현금 흐름과 브랜드 신뢰를 동시에 확보합니다.',
    icon: Hospital,
    color: '#2563eb',
    image:
      '/images/sectors/medical.jpg',
    thumb:
      '/images/sectors/medical.jpg',
    points: ['Primary Sector', 'Clinic Network', 'Medical Infrastructure'],
    metrics: [
      { label: 'Role', value: 'Core' },
      { label: 'Yield Base', value: 'Real' },
      { label: 'Flow', value: 'On-chain' },
    ],
  },
  {
    id: '02',
    name: 'Hotel/Resort',
    title: '호텔/리조트',
    desc: '태국 등 주요 관광지 프리미엄 숙박 시설 및 리조트 운영',
    detail: '프리미엄 숙박 자산과 리조트 운영 수익을 장기 포트폴리오에 편입합니다.',
    icon: Hotel,
    color: '#4f46e5',
    image:
      '/images/sectors/resort.jpg',
    thumb:
      '/images/sectors/resort.jpg',
    points: ['Hospitality', 'Tourism Revenue', 'Premium Stay'],
    metrics: [
      { label: 'Demand', value: 'Global' },
      { label: 'Asset Type', value: 'Hospitality' },
      { label: 'Model', value: 'Operate' },
    ],
  },
  {
    id: '03',
    name: 'Real Estate',
    title: '부동산',
    desc: '상업용 부동산 임대 관리 및 자산 가치 상승 시세 차익',
    detail: '임대 수익과 자산 가치 상승 여력을 동시에 반영하는 보수적 레이어입니다.',
    icon: Building2,
    color: '#3b82f6',
    image:
      '/images/sectors/real-estate.jpg',
    thumb:
      '/images/sectors/real-estate.jpg',
    points: ['Commercial Asset', 'Rental Yield', 'Capital Gain'],
    metrics: [
      { label: 'Risk', value: 'Defensive' },
      { label: 'Cashflow', value: 'Recurring' },
      { label: 'Upside', value: 'Value-up' },
    ],
  },
  {
    id: '04',
    name: 'Global Trade',
    title: '글로벌 무역',
    desc: '글로벌 무역 결제망 및 원자재 소싱 유통망 확보',
    detail: '결제망과 소싱 채널을 함께 확보해 실물 거래 흐름을 포트폴리오 자산으로 다룹니다.',
    icon: Globe2,
    color: '#0891b2',
    image:
      '/images/sectors/global-trade.jpg',
    thumb:
      '/images/sectors/global-trade.jpg',
    points: ['Settlement', 'Sourcing', 'Distribution'],
    metrics: [
      { label: 'Scope', value: 'Global' },
      { label: 'Infra', value: 'Trade Rail' },
      { label: 'Type', value: 'Network' },
    ],
  },
  {
    id: '05',
    name: 'F&B Service',
    title: 'F&B 서비스',
    desc: '럭셔리 다이닝 브랜드 및 프랜차이즈 시스템 구축',
    detail: '브랜드 경험과 반복 매출을 동시에 확보하는 F&B 운영 자산입니다.',
    icon: UtensilsCrossed,
    color: '#ea580c',
    image:
      '/images/sectors/fnb.jpg',
    thumb:
      '/images/sectors/fnb.jpg',
    points: ['Dining Brand', 'Franchise', 'Recurring Revenue'],
    metrics: [
      { label: 'Format', value: 'Brand' },
      { label: 'Sales', value: 'Repeat' },
      { label: 'Growth', value: 'Scale-up' },
    ],
  },
  {
    id: '06',
    name: 'FinTech',
    title: '핀테크',
    desc: '블록체인 기반 디지털 금융 결제 및 송금 솔루션',
    detail: '디지털 금융 인프라와 온체인 결제 경험을 연결하는 트랜잭션 중심 섹터입니다.',
    icon: Landmark,
    color: '#1d4ed8',
    image:
      '/images/sectors/fintech.jpg',
    thumb:
      '/images/sectors/fintech.jpg',
    points: ['Payments', 'Remittance', 'Financial Rail'],
    metrics: [
      { label: 'Type', value: 'Infra' },
      { label: 'Speed', value: 'Instant' },
      { label: 'Trust', value: 'Audited' },
    ],
  },
  {
    id: '07',
    name: 'Technological',
    title: '테크놀로지',
    desc: 'AI 및 Web3 기술 개발 플랫폼 및 솔루션 공급',
    detail: 'AI와 Web3 솔루션을 공급하는 기술 레이어로 포트폴리오 확장성을 뒷받침합니다.',
    icon: Cpu,
    color: '#7c3aed',
    image:
      '/images/sectors/technology.jpg',
    thumb:
      '/images/sectors/technology.jpg',
    points: ['AI', 'Web3', 'Platform'],
    metrics: [
      { label: 'Engine', value: 'Tech' },
      { label: 'Use', value: 'B2B' },
      { label: 'Scale', value: 'Modular' },
    ],
  },
  {
    id: '08',
    name: 'Entertainment',
    title: '엔터테인먼트',
    desc: '글로벌 미디어 콘텐츠 제작 및 아티스트 협업 비즈니스',
    detail: '콘텐츠 IP와 글로벌 협업 모델을 통해 브랜드 파급력과 수익 다변화를 만듭니다.',
    icon: Clapperboard,
    color: '#db2777',
    image:
      '/images/sectors/entertainment.jpg',
    thumb:
      '/images/sectors/entertainment.jpg',
    points: ['Content IP', 'Artist Network', 'Media Business'],
    metrics: [
      { label: 'Value', value: 'IP' },
      { label: 'Reach', value: 'Global' },
      { label: 'Model', value: 'Collab' },
    ],
  },
  {
    id: '09',
    name: 'Logistics',
    title: '물류',
    desc: '스마트 물류 시스템 및 글로벌 배송 인프라 자산',
    detail: '글로벌 배송과 물류 효율화를 담당하는 운영 인프라를 포트폴리오에 포함합니다.',
    icon: Package,
    color: '#059669',
    image:
      '/images/sectors/logistics.jpg',
    thumb:
      '/images/sectors/logistics.jpg',
    points: ['Smart Logistics', 'Delivery Flow', 'Infrastructure'],
    metrics: [
      { label: 'Infra', value: 'Logistics' },
      { label: 'Range', value: 'Cross-border' },
      { label: 'Strength', value: 'Efficiency' },
    ],
  },
  {
    id: '10',
    name: 'Cosmetics',
    title: '코스메틱',
    desc: '자체 코스메틱 브랜드 런칭 및 글로벌 온/오프라인 유통',
    detail: '자체 브랜드와 유통 채널을 함께 확보하는 소비재 섹터입니다.',
    icon: Sparkles,
    color: '#e11d48',
    image:
      '/images/sectors/cosmetics.jpg',
    thumb:
      '/images/sectors/cosmetics.jpg',
    points: ['Brand Launch', 'Distribution', 'Beauty'],
    metrics: [
      { label: 'Category', value: 'Beauty' },
      { label: 'Format', value: 'Brand-led' },
      { label: 'Channel', value: 'Hybrid' },
    ],
  },
  {
    id: '11',
    name: 'Education',
    title: '교육',
    desc: '블록체인 및 금융 리터러시 교육 아카데미 운영',
    detail: '장기 사용자 기반과 리터러시 형성을 통해 생태계 저변을 넓힙니다.',
    icon: GraduationCap,
    color: '#7c3aed',
    image:
      '/images/sectors/education.jpg',
    thumb:
      '/images/sectors/education.jpg',
    points: ['Academy', 'Literacy', 'Community'],
    metrics: [
      { label: 'Base', value: 'Community' },
      { label: 'Value', value: 'Education' },
      { label: 'Effect', value: 'Retention' },
    ],
  },
  {
    id: '12',
    name: 'Agriculture',
    title: '농업',
    desc: '스마트 팜 기반 고부가가치 농산물 생산',
    detail: '고부가가치 생산 기반을 갖춘 스마트 팜 자산으로 실물 포트폴리오를 보강합니다.',
    icon: Leaf,
    color: '#16a34a',
    image:
      '/images/sectors/agriculture.jpg',
    thumb:
      '/images/sectors/agriculture.jpg',
    points: ['Smart Farm', 'Production', 'Agritech'],
    metrics: [
      { label: 'Type', value: 'Agri-tech' },
      { label: 'Value', value: 'High-margin' },
      { label: 'Model', value: 'Smart Farm' },
    ],
  },
  {
    id: '13',
    name: 'Media/Ad',
    title: '미디어/광고',
    desc: '글로벌 옥외 광고 및 디지털 마케팅 플랫폼 자산',
    detail: '브랜드 노출과 직접 수익화를 동시에 가져갈 수 있는 미디어 자산 영역입니다.',
    icon: Megaphone,
    color: '#ef4444',
    image:
      '/images/sectors/media-ad.jpg',
    thumb:
      '/images/sectors/media-ad.jpg',
    points: ['Media Asset', 'Ad Platform', 'Brand Reach'],
    metrics: [
      { label: 'Asset', value: 'Media' },
      { label: 'Use', value: 'Branding' },
      { label: 'Output', value: 'Reach' },
    ],
  },
  {
    id: '14',
    name: 'Tourism',
    title: '관광',
    desc: '맞춤형 럭셔리 투어 가이드 및 VIP 의전 서비스 운영',
    detail: 'VIP 대상 맞춤형 투어 및 의전 서비스로 프리미엄 관광 수요를 흡수합니다.',
    icon: Plane,
    color: '#0ea5e9',
    image:
      '/images/sectors/tourism.jpg',
    thumb:
      '/images/sectors/tourism.jpg',
    points: ['Luxury Tour', 'VIP Service', 'Travel'],
    metrics: [
      { label: 'Audience', value: 'Premium' },
      { label: 'Model', value: 'Service' },
      { label: 'Region', value: 'Global' },
    ],
  },
  {
    id: '15',
    name: 'E-Commerce',
    title: '이커머스',
    desc: 'BANA 토큰 전용 폐쇄형 몰 및 글로벌 쇼핑 플랫폼',
    detail: '토큰 유틸리티와 소비 경험을 직접 연결하는 클로즈드 커머스 레이어입니다.',
    icon: ShoppingBag,
    color: '#2563eb',
    image:
      '/images/sectors/ecommerce.jpg',
    thumb:
      '/images/sectors/ecommerce.jpg',
    points: ['Token Utility', 'Closed Mall', 'Commerce'],
    metrics: [
      { label: 'Utility', value: 'Token' },
      { label: 'Model', value: 'Closed' },
      { label: 'Benefit', value: 'Conversion' },
    ],
  },
  {
    id: '16',
    name: 'ESG Energy',
    title: 'ESG 에너지',
    desc: '친환경 에너지 인프라 및 탄소 배출권 관련 자산 운용',
    detail: '친환경 에너지와 ESG 관련 자산을 통해 장기 지속 가능성과 제도 친화성을 확보합니다.',
    icon: BatteryCharging,
    color: '#0f766e',
    image:
      '/images/sectors/esg-energy.jpg',
    thumb:
      '/images/sectors/esg-energy.jpg',
    points: ['Green Infra', 'Carbon Credit', 'ESG'],
    metrics: [
      { label: 'Theme', value: 'Sustainable' },
      { label: 'Class', value: 'Infra' },
      { label: 'Long-term', value: 'Yes' },
    ],
  },
];

const PRINCIPLES = [
  {
    key: 'Stability',
    title: '70%+ 실물 자산 유지',
    desc: '실체가 확인된 실물 자산 비중을 전체의 70% 이상으로 유지합니다.',
    icon: ShieldCheck,
  },
  {
    key: 'Hedging',
    title: '섹터 간 리스크 분산',
    desc: '상관관계 분석을 통해 특정 산업 리스크의 전이를 방어합니다.',
    icon: ScanSearch,
  },
  {
    key: 'Growth',
    title: '목표 수익률 방어',
    desc: '다양한 섹터를 결합해 어떤 시장 환경에서도 안정적인 목표 수익률을 지향합니다.',
    icon: TrendingUp,
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export default function RealBusinessSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.35 });
  const sectorsText = t('realBusiness.sectors', { returnObjects: true }) as Array<{
    id: string;
    name: string;
    title: string;
    desc: string;
    detail: string;
    points: string[];
    metrics: Array<{ label: string; value: string }>;
  }>;
  const principlesText = t('realBusiness.principles', { returnObjects: true }) as Array<{
    key: string;
    title: string;
    desc: string;
  }>;
  const sectorsTextById = useMemo(
    () => new Map(sectorsText.map((sector) => [sector.id, sector])),
    [sectorsText],
  );
  const principlesTextByKey = useMemo(
    () => new Map(principlesText.map((principle) => [principle.key, principle])),
    [principlesText],
  );

  useEffect(() => {
    if (!isInView || isPaused) return;

    const startedAt = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(elapsed / ROTATE_INTERVAL_MS, 1);
      setProgress(nextProgress);
    }, 50);

    const rotateTimer = setTimeout(() => {
      setActive((prev) => (prev + 1) % SECTORS.length);
      setProgress(0);
    }, ROTATE_INTERVAL_MS);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(rotateTimer);
    };
  }, [active, isPaused, isInView]);

  const currentText = sectorsTextById.get(SECTORS[active].id);
  const current = currentText
    ? { ...SECTORS[active], ...currentText }
    : SECTORS[active];
  const progressCircumference = 2 * Math.PI * 15;
  const progressOffset = progressCircumference * (1 - progress);

  return (
    <section
      ref={sectionRef}
      id="real-business"
      className="relative overflow-hidden bg-[#f5f7fb] py-28 sm:py-36"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.10),transparent_28%),linear-gradient(180deg,#fbfcfe_0%,#f5f7fb_42%,#eef3f9_100%)]" />

        <motion.div
          animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[-9rem] h-[26rem] w-[54rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(125,170,255,0.22) 0%, rgba(125,170,255,0.08) 38%, rgba(125,170,255,0) 72%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-white/70 bg-white/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b7280] shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            {t('realBusiness.badge')}
          </div>

          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#7b8494]">
            {t('realBusiness.eyebrow')}
          </p>

          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] text-[#111827] sm:text-5xl lg:text-[4rem] lg:leading-[1.04]">
            {t('realBusiness.title')}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-balance text-[17px] font-medium leading-relaxed text-[#6b7280] sm:text-[20px]">
            {t('realBusiness.description')}
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Left Detail */}
          <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/72 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Hero Image */}
                <div className="relative h-[320px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]">
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,28,0.10)_0%,rgba(12,18,28,0.18)_36%,rgba(12,18,28,0.55)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_100%)]" />

                  <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-8 sm:top-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/30 bg-white/18 backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
                      <current.icon className="h-6 w-6 text-white" />
                    </div>

                    <div
                      className="rounded-full border border-white/30 bg-white/16 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 backdrop-blur-xl"
                    >
                      {current.id}
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.30em] text-white/70">
                      {current.name}
                    </p>
                    <h3 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-white sm:text-[2.6rem]">
                      {current.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/82 sm:text-[17px]">
                      {current.desc}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-[#6b7280] sm:text-[16px]">
                    {current.detail}
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {current.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-[20px] border border-[#e8eef7] bg-white/76 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.20em] text-[#7b8494]">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-[#111827]">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {current.points.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-[#e7edf7] bg-[#f8fbff] px-3.5 py-2 text-[12px] font-semibold text-[#334155] shadow-[0_6px_18px_rgba(15,23,42,0.04)]"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right List */}
          <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/66 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.26))]" />

            <div className="relative z-10 mb-5 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#7b8494]">
                  {t('realBusiness.sideLabel')}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-2 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused((prev) => !prev);
                    setProgress(0);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f7ff] text-[#2563eb] transition-colors hover:bg-[#eaf1ff]"
                  aria-label={isPaused ? t('realBusiness.controls.playLabel') : t('realBusiness.controls.pauseLabel')}
                >
                  {isPaused ? (
                    <Play className="h-4 w-4 fill-current" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </button>

                <div className="flex items-center gap-2 pr-2">
                  <div className="relative flex h-9 w-9 items-center justify-center">
                    <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="rgba(37,99,235,0.12)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={progressCircumference}
                        strokeDashoffset={progressOffset}
                        className="text-[#2563eb] transition-[stroke-dashoffset] duration-75 ease-linear"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-semibold text-[#2563eb]">
                      {isPaused ? t('realBusiness.controls.paused') : t('realBusiness.controls.auto')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SECTORS.map((sector, index) => {
                const sectorText = sectorsTextById.get(sector.id) ?? sector;

                return (
                <motion.button
                  key={sector.id}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{
                    delay: index * 0.02,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => {
                    setActive(index);
                    setProgress(0);
                  }}
                  className={`group relative overflow-hidden rounded-[24px] border text-left transition-all duration-300 ${active === index
                    ? 'border-white bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]'
                    : 'border-white/70 bg-white/58 hover:bg-white/86 hover:shadow-[0_10px_22px_rgba(15,23,42,0.05)]'
                    }`}
                >
                  {active === index && (
                    <motion.div
                      layoutId="sectorHighlight"
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, ${sector.color}10, rgba(255,255,255,0.96))`,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3 p-3">
                    <div className="relative h-16 w-20 overflow-hidden rounded-[16px] bg-[#eef4ff]">
                      <Image
                        src={sector.thumb || sector.image}
                        alt={sector.title}
                        fill
                        sizes="(min-width: 1024px) 10rem, 5rem"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.12))]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold tracking-[0.16em] text-[#94a3b8]">
                          {sector.id}
                        </span>
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7b8494]">
                          {sectorText.name}
                        </p>
                      </div>

                      <p className="mt-1 truncate text-[15px] font-semibold tracking-[-0.03em] text-[#111827]">
                        {sectorText.title}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80"
                          style={{ color: sector.color }}
                        >
                          <sector.icon className="h-4 w-4" />
                        </div>
                        <span className="truncate text-[12px] text-[#6b7280]">
                          {sectorText.points[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              )})}
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PRINCIPLES.map((principle, index) => {
            const principleText = principlesTextByKey.get(principle.key) ?? principle;

            return (
            <motion.div
              key={principle.key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: index * 0.08,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-[30px] border border-white/75 bg-white/72 p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f5f9ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                <principle.icon className="h-5 w-5 text-[#2563eb]" />
              </div>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7b8494]">
                {principleText.key}
              </p>

              <h4 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#111827]">
                {principleText.title}
              </h4>

              <p className="mt-3 text-[15px] leading-relaxed text-[#6b7280]">
                {principleText.desc}
              </p>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
