import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/landing/Hero';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { CTASection } from '@/components/landing/CTASection';

export const metadata: Metadata = {
  title: 'Recastly — Turn YouTube Videos into Platform-Perfect Content',
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
