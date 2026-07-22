import type { Metadata, Viewport } from 'next';
import LocalFont from 'next/font/local';
import './globals.css';
import ClientProviders from './providers';

const edameh = LocalFont({
  src: '../../public/fonts/Gofteh-Heavy.ttf',
  weight: '900',
  variable: '--font-edameh',
  display: 'swap',
});

const yekanRegular = LocalFont({
  src: '../../public/fonts/YekanBakh-Regular.woff2',
  weight: '400',
  variable: '--font-yekan',
  display: 'swap',
});

const yekanSemiBold = LocalFont({
  src: '../../public/fonts/YekanBakh-SemiBold.woff2',
  weight: '600',
  variable: '--font-yekan-semibold',
  display: 'swap',
});

const yekanBold = LocalFont({
  src: '../../public/fonts/YekanBakh-Bold.woff2',
  weight: '700',
  variable: '--font-yekan-bold',
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
    <html lang="fa" dir="rtl" className={`${edameh.variable} ${yekanRegular.variable} ${yekanSemiBold.variable} ${yekanBold.variable} dark`} suppressHydrationWarning>
      <head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
      <body className={`${yekanRegular.className} antialiased`}><ClientProviders>{children}</ClientProviders></body>
    </html>
  );
}
