import HeroSection from '@/components/sections/HeroSection';
import CoreValueSection from '@/components/sections/CoreValueSection';
import RealBusinessSection from '@/components/sections/RealBusinessSection';
import TokenomicsSection from '@/components/sections/TokenomicsSection';
import RewardSection from '@/components/sections/RewardSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import SecuritySection from '@/components/sections/SecuritySection';
import EcosystemSection from '@/components/sections/EcosystemSection';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CoreValueSection />
        <RealBusinessSection />
        <TokenomicsSection />
        <RewardSection />
        <RoadmapSection />
        <SecuritySection />
        <EcosystemSection />
      </main>
      <Footer />
    </>
  );
}
