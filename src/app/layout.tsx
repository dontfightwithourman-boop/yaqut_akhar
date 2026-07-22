import type { Metadata, Viewport } from 'next';
import LocalFont from 'next/font/local';
import './globals.css';
import ClientProviders from './providers';

const gofteh = LocalFont({
  src: '../../public/fonts/Gofteh-Heavy.ttf',
  variable: '--font-gofteh',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران', template: '%s | یاقوت سمینار' },
  description: 'چهلمین سمینار علوم و فنون - مدرسه راهنمایی علامه حلی 1 تهران',
  keywords: ['سمینار', 'یاقوت', 'مسابقه', 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران'],
  openGraph: { type: 'website', locale: 'fa_IR', siteName: 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران', title: 'یاقوت سمینار', description: 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#003049', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${gofteh.variable} dark`} suppressHydrationWarning>
      <head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
      <body className={`${gofteh.className} antialiased`}><ClientProviders>{children}</ClientProviders></body>
    </html>
  );
}
