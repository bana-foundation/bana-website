import type { Metadata } from "next";
import I18nProvider from "@/components/providers/I18nProvider";
import { getRequestLanguage } from "@/i18n/server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const isEnglish = language === 'en';

  return {
    title: "BANA Protocol — RWA & Web3 Financial OS",
    description: isEnglish
      ? "A next-generation RWA protocol connecting real-world assets with Web3. Medical infrastructure, resorts, and distribution networks brought on-chain."
      : "실물 자산과 Web3를 연결하는 차세대 RWA 프로토콜. 강남 의료 인프라, 골프 리조트, 유통 네트워크를 블록체인에 담습니다.",
    keywords: ["RWA", "Web3", "DeFi", "blockchain", "tokenization", "medical", "BANA"],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();

  return (
    <html lang={language} className="antialiased" suppressHydrationWarning>
      <body>
        <I18nProvider initialLanguage={language}>{children}</I18nProvider>
      </body>
    </html>
  );
}
