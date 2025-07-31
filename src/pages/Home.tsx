import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import TopProviders from "@/components/TopProviders";
import TrendingServices from "@/components/TrendingServices";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategorySection />
      <TopProviders />
      <TrendingServices />
      <Newsletter />
      <Footer />
    </div>
  );
}
