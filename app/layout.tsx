import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://recastly.app'),
  title: {
    default: 'Recastly — Turn YouTube Videos into Platform-Perfect Content',
    template: '%s | Recastly',
  },
  description:
    'Paste a YouTube URL and instantly get LinkedIn posts, Twitter threads, newsletter editions, and Instagram captions — all powered by Claude AI.',
  keywords: ['content repurposing', 'youtube to linkedin', 'ai content generator', 'twitter thread generator', 'newsletter ai'],
  authors: [{ name: 'Recastly' }],
  creator: 'Recastly',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Recastly — Turn YouTube Videos into Platform-Perfect Content',
    description:
      'Paste a YouTube URL and instantly get LinkedIn posts, Twitter threads, newsletter editions, and Instagram captions — powered by Claude AI.',
    siteName: 'Recastly',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Recastly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recastly — YouTube to Content in Seconds',
    description: 'AI-powered content repurposing for every platform.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
