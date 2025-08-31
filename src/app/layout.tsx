import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';
import TypographyProvider from '@/components/TypographyProvider';
import NewsletterBanner from '@/components/NewsletterBanner';
import CustomizationProvider from '@/components/CustomizationProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ICE SUPER Blog - Casino Tech, Affiliate Growth & iGaming Future',
  description: 'Stay ahead in the iGaming industry with insights on casino technology, affiliate marketing strategies, and regulatory trends from ICE SUPER.',
  keywords: 'iGaming, casino technology, affiliate marketing, B2B gaming, casino trends, gaming regulation',
  authors: [{ name: 'ICE SUPER' }],
  openGraph: {
    title: 'ICE SUPER Blog',
    description: 'Casino Tech, Affiliate Growth & the Future of iGaming',
    url: 'https://icesuper.com/blog',
    siteName: 'ICE SUPER',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ICE SUPER Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICE SUPER Blog',
    description: 'Casino Tech, Affiliate Growth & the Future of iGaming',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <CustomizationProvider>
            <TypographyProvider>
              <NewsletterBanner />
              {children}
            </TypographyProvider>
          </CustomizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
