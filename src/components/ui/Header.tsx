'use client';

import type { SVGProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Activity, Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function XLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 2H21.98l-6.725 7.684L23.167 22h-6.192l-4.85-6.35L6.57 22H3.49l7.193-8.222L1.167 2h6.35l4.384 5.79L18.9 2Zm-1.086 18.148h1.706L6.24 3.757H4.41l13.405 16.39Z" />
    </svg>
  );
}

function TelegramLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.944 4.548a1.5 1.5 0 0 0-1.69-.214L3.06 11.79a1.5 1.5 0 0 0 .111 2.795l4.425 1.57 1.57 4.425a1.5 1.5 0 0 0 2.795.111l7.455-17.194a1.5 1.5 0 0 0-.214-1.69 1.5 1.5 0 0 0-1.69-.214Z" />
      <path d="M9.212 15.182 17.64 6.75c.23-.23.59.06.433.35l-5.31 9.484a1 1 0 0 1-1.74-.084l-1.06-2.001a1 1 0 0 1 .249-1.317Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: 'https://x.com/edutoken9574', label: 'X', icon: XLogo },
  { href: 'https://t.me/edutoken_official', label: 'Telegram', icon: TelegramLogo },
] as const;

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('core-value');
  const [scrolled, setScrolled] = useState(false);

  const lang = (i18n.language?.startsWith('en') ? 'en' : 'ko') as 'ko' | 'en';
  const sections = useMemo(
    () => t('header.nav', { returnObjects: true }) as Array<{ id: string; label: string }>,
    [t],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      let current = '';
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = section.id;
        }
      });

      if (!current && window.scrollY < 300) {
        current = 'core-value';
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const targetY = element.getBoundingClientRect().top + window.scrollY - 96;

    setMenuOpen(false);
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const headerShell = scrolled
    ? 'border border-slate-200/80 bg-white/82 text-slate-900 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
    : 'border border-white/14 bg-white/10 text-white shadow-[0_18px_48px_rgba(3,18,51,0.18)] backdrop-blur-xl';

  const mutedText = scrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/72 hover:text-white';
  const strongText = scrolled ? 'text-slate-900' : 'text-white';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-[1.75rem] px-5 py-4 transition-all duration-500 lg:px-7 ${headerShell}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 focus:outline-none"
          aria-label="BANA PROTOCOL"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-300 shadow-[0_16px_28px_rgba(32,130,255,0.28)]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${scrolled ? 'text-[var(--bana-accent-blue)]' : 'text-blue-100/90'}`}>
              {t('header.brandEyebrow')}
            </p>
            <p className={`text-[1.05rem] font-semibold tracking-tight ${strongText}`}>{t('header.brandTitle')}</p>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1 rounded-full px-2 py-1">
          {sections.map((section) => {
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${
                  active
                    ? scrolled
                      ? 'bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]'
                      : 'bg-white text-slate-900 shadow-[0_10px_24px_rgba(255,255,255,0.16)]'
                    : mutedText
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDesktopLangOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${
                scrolled
                  ? 'border-slate-200 bg-white/80 text-slate-700 hover:text-slate-900'
                  : 'border-white/18 bg-white/10 text-white/80 hover:text-white'
              }`}
            >
              <Globe className="h-4 w-4" />
              {lang.toUpperCase()}
            </button>

            {desktopLangOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+0.75rem)] min-w-[88px] rounded-2xl border p-1 shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${
                  scrolled ? 'border-slate-200 bg-white/95' : 'border-white/14 bg-[rgba(4,20,55,0.92)]'
                }`}
              >
                {(['ko', 'en'] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      void i18n.changeLanguage(value);
                      setDesktopLangOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors ${
                      lang === value
                        ? scrolled
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-900'
                        : scrolled
                          ? 'text-slate-600 hover:bg-slate-50'
                          : 'text-white/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                  scrolled
                    ? 'border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:text-slate-900'
                    : 'border-white/14 bg-white/10 text-white/82 hover:-translate-y-0.5 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <div className="relative">
            <button
              onClick={() => setMobileLangOpen((prev) => !prev)}
              className={`flex h-10 items-center rounded-full border px-3 text-[12px] font-semibold ${
                scrolled
                  ? 'border-slate-200 bg-white/80 text-slate-700'
                  : 'border-white/18 bg-white/10 text-white/82'
              }`}
            >
              {lang.toUpperCase()}
            </button>

            {mobileLangOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+0.65rem)] min-w-[88px] rounded-2xl border p-1 shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${
                  scrolled ? 'border-slate-200 bg-white/95' : 'border-white/14 bg-[rgba(4,20,55,0.92)]'
                }`}
              >
                {(['ko', 'en'] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      void i18n.changeLanguage(value);
                      setMobileLangOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[12px] font-semibold ${
                      lang === value
                        ? scrolled
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-900'
                        : scrolled
                          ? 'text-slate-600'
                          : 'text-white/78'
                    }`}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              scrolled
                ? 'border-slate-200 bg-white/80 text-slate-900'
                : 'border-white/18 bg-white/10 text-white'
            }`}
            aria-label="메뉴"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-400 md:hidden ${
          menuOpen ? 'pointer-events-auto max-h-[32rem] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto mt-3 max-w-7xl px-1">
          <div className="rounded-[1.75rem] border border-white/14 bg-[rgba(4,20,55,0.88)] px-5 py-5 shadow-[0_24px_48px_rgba(3,18,51,0.24)] backdrop-blur-2xl">
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`rounded-2xl px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-white text-slate-900'
                      : 'text-white/84 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-11 flex-1 items-center justify-center rounded-2xl border border-white/14 bg-white/8 text-white/84 transition-colors hover:bg-white/12 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
