import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ServiceCategories from "@/components/landing/ServiceCategories";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <ServiceCategories />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
