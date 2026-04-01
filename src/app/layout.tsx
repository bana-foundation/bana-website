import type { Metadata } from "next";
import I18nProvider from "@/components/providers/I18nProvider";
import { getRequestLanguage } from "@/i18n/server";
import { getMetadataBase, getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const metadataBase = getMetadataBase();
const ogImage = "/og-image.png";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const description =
    language === 'ko'
      ? "실물 자산과 Web3를 연결하는 차세대 RWA 프로토콜. 강남 의료 인프라, 골프 리조트, 유통 네트워크를 블록체인에 담습니다."
      : language === 'zh'
        ? "连接现实资产与 Web3 的下一代 RWA 协议。将医疗基础设施、度假资产与流通网络带上链。"
        : language === 'th'
          ? "โปรโตคอล RWA ยุคใหม่ที่เชื่อมสินทรัพย์โลกจริงกับ Web3 นำโครงสร้างพื้นฐานการแพทย์ รีสอร์ต และเครือข่ายการกระจายสินค้าขึ้นสู่บล็อกเชน"
          : language === 'vi'
            ? "Giao thức RWA thế hệ mới kết nối tài sản thực với Web3, đưa hạ tầng y tế, resort và mạng lưới phân phối lên blockchain."
            : "A next-generation RWA protocol connecting real-world assets with Web3. Medical infrastructure, resorts, and distribution networks brought on-chain.";

  return {
    metadataBase,
    title: "BANA Protocol — RWA & Web3 Financial OS",
    description,
    keywords: ["RWA", "Web3", "DeFi", "blockchain", "tokenization", "medical", "BANA"],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "BANA Protocol",
      title: "BANA Protocol — RWA & Web3 Financial OS",
      description,
      locale:
        language === "ko"
          ? "ko_KR"
          : language === "zh"
            ? "zh_CN"
            : language === "th"
              ? "th_TH"
              : language === "vi"
                ? "vi_VN"
                : "en_US",
      images: [
        {
          url: ogImage,
          width: 192,
          height: 192,
          alt: "BANA Protocol",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "BANA Protocol — RWA & Web3 Financial OS",
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BANA Protocol",
    logo: siteUrl ? `${siteUrl}/logo.svg` : "/logo.svg",
    ...(siteUrl ? { url: siteUrl } : {}),
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BANA Protocol",
    ...(siteUrl ? { url: siteUrl } : {}),
  };

  return (
    <html lang={language} className="antialiased" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <I18nProvider initialLanguage={language}>{children}</I18nProvider>
      </body>
    </html>
  );
}
