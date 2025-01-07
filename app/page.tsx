import { Navbar } from '@/components/layout/navbar';
import { BenefitsSection } from '@/components/layout/sections/benefits';
import { BundleSection } from '@/components/layout/sections/bundle';
import { ContactSection } from '@/components/layout/sections/contact';
import { CTASection } from '@/components/layout/sections/cta';
import { FAQSection } from '@/components/layout/sections/faq';
import { FeaturesSection } from '@/components/layout/sections/features';
import { FooterSection } from '@/components/layout/sections/footer';
import { HeroSection } from '@/components/layout/sections/hero';
// import { ServicesSection } from '@/components/layout/sections/services';
import { ProductsSection } from '@/components/layout/sections/products';
import { SponsorsSection } from '@/components/layout/sections/sponsors';
import { TestimonialSection } from '@/components/layout/sections/testimonial';

export const metadata = {
  title: 'Buddha Ayurveda - Ayurvedic Health Products',
  description: 'At Budhha Ayurveda, we bring the power of nature to your doorstep. Experience pure Ayurveda, crafted for modern lifestyles.',
  openGraph: {
    type: 'website',
    url: 'https://www.instagram.com/buddha_ayurveda/',
    title: 'Buddha Ayurveda - Ayurvedic Health Products',
    description: 'At Budhha Ayurveda, we bring the power of nature to your doorstep. Experience pure Ayurveda, crafted for modern lifestyles.',
    images: [
      {
        url: 'https://res.cloudinary.com/unchartedrealm/image/upload/v1736227669/logo_chjlfr.jpg',
        width: 1200,
        height: 630,
        alt: 'Buddha Ayurveda - Ayurvedic Health Products',
      },
    ],
  },
  twitter: {
    // card: 'summary_large_image',
    site: 'https://www.instagram.com/buddha_ayurveda/',
    title: 'Buddha Ayurveda - Ayurvedic Health Products',
    description: 'At Budhha Ayurveda, we bring the power of nature to your doorstep. Experience pure Ayurveda, crafted for modern lifestyles.',
    images: [
      'https://res.cloudinary.com/unchartedrealm/image/upload/v1736227669/logo_chjlfr.jpg',
    ],
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      {/* <ServicesSection /> */}
      <TestimonialSection />
      <ProductsSection />
      <CTASection />
      <BundleSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
