'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

const SOCIAL_LINKS = [
  { href: 'https://x.com', label: 'X', icon: FaXTwitter },
  { href: 'https://t.me', label: 'Telegram', icon: FaTelegramPlane },
] as const;

const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'th', label: 'ไทย' },
  { value: 'vi', label: 'Tiếng Việt' },
] as const;

type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]['value'];

function normalizeLanguage(value: string | undefined): LanguageCode {
  const match = LANGUAGE_OPTIONS.find((option) => value?.startsWith(option.value));
  return match?.value ?? 'ko';
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const lang = normalizeLanguage(i18n.language);
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

  const scrollToTop = () => {
    setMenuOpen(false);
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerShell = scrolled
    ? 'border border-slate-200/80 bg-white/82 text-slate-900 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
    : 'border border-white/14 bg-white/10 text-white shadow-[0_18px_48px_rgba(3,18,51,0.18)] backdrop-blur-xl';

  const mutedText = scrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/72 hover:text-white';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-[1.75rem] px-5 py-4 transition-all duration-500 lg:px-7 ${headerShell}`}>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-3 focus:outline-none"
          aria-label="BANA PROTOCOL"
        >
          <Image src="/logo_alt.png" alt="BANA logo" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />
          <div className="text-left leading-none">
            <p className={`text-[1rem] font-semibold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>BANA</p>
            <p className={`mt-1 text-[11px] font-medium tracking-[0.08em] ${scrolled ? 'text-slate-500' : 'text-white/72'}`}>RWA &amp; Healthcare</p>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1 rounded-full px-2 py-1">
          {sections.map((section) => {
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${active
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
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${scrolled
                ? 'border-slate-200 bg-white/80 text-slate-700 hover:text-slate-900'
                : 'border-white/18 bg-white/10 text-white/80 hover:text-white'
                }`}
            >
              <Globe className="h-4 w-4" />
              {LANGUAGE_OPTIONS.find((option) => option.value === lang)?.label ?? '한국어'}
            </button>

            {desktopLangOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+0.75rem)] min-w-[120px] rounded-2xl border p-1 backdrop-blur-2xl transition-all duration-500 ${scrolled
                  ? 'border border-slate-200/80 bg-white/88 shadow-[0_18px_48px_rgba(15,23,42,0.08)]'
                  : 'border border-white/14 bg-white/10 shadow-[0_24px_48px_rgba(3,18,51,0.24)]'
                  }`}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      void i18n.changeLanguage(option.value);
                      setDesktopLangOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors ${lang === option.value
                      ? scrolled
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-900'
                      : scrolled
                        ? 'text-slate-600 hover:bg-slate-50'
                        : 'text-white/75 hover:bg-white/8 hover:text-white'
                      }`}
                  >
                    {option.label}
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
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${scrolled
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
              className={`flex h-10 items-center rounded-full border px-3 text-[12px] font-semibold ${scrolled
                ? 'border-slate-200 bg-white/80 text-slate-700'
                : 'border-white/18 bg-white/10 text-white/82'
                }`}
            >
              {LANGUAGE_OPTIONS.find((option) => option.value === lang)?.label ?? '한국어'}
            </button>

            {mobileLangOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+0.65rem)] min-w-[120px] rounded-2xl border p-1 backdrop-blur-2xl transition-all duration-500 ${scrolled
                  ? 'border border-slate-200/80 bg-white/88 shadow-[0_18px_48px_rgba(15,23,42,0.08)]'
                  : 'border border-white/14 bg-white/10 shadow-[0_24px_48px_rgba(3,18,51,0.24)]'
                  }`}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      void i18n.changeLanguage(option.value);
                      setMobileLangOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[12px] font-semibold ${lang === option.value
                      ? scrolled
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-900'
                      : scrolled
                        ? 'text-slate-600'
                        : 'text-white/78'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${scrolled
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
        className={`overflow-hidden transition-all duration-400 md:hidden ${menuOpen ? 'pointer-events-auto max-h-[32rem] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          }`}
      >
        <div className="mx-auto mt-3 max-w-7xl px-1">
          <div
            className={`rounded-[1.75rem] px-5 py-5 backdrop-blur-2xl transition-all duration-500 ${scrolled
              ? 'border border-slate-200/80 bg-white/88 shadow-[0_18px_48px_rgba(15,23,42,0.08)]'
              : 'border border-white/14 bg-white/10 shadow-[0_24px_48px_rgba(3,18,51,0.24)]'
              }`}
          >
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`rounded-2xl px-4 py-3 text-left text-[15px] font-medium transition-colors ${activeSection === section.id
                    ? scrolled
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-900'
                    : scrolled
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
                  className={`flex h-11 flex-1 items-center justify-center rounded-2xl border transition-colors ${scrolled
                    ? 'border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    : 'border-white/14 bg-white/8 text-white/84 hover:bg-white/12 hover:text-white'
                    }`}
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
