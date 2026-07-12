import type { Metadata, Viewport } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import ClientProviders from './providers';

const vazirmatn = Vazirmatn({ subsets: ['arabic'], weight: ['400', '600', '700', '900'], variable: '--font-vazirmatn', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'یاقوت سمینار — مسابقه پروژه‌های دانشجویی', template: '%s | یاقوت سمینار' },
  description: 'مسابقه پروژه‌های دانشجویی سمینار — جایی که تلاش شما به یاقوت تبدیل می‌شود',
  keywords: ['سمینار', 'یاقوت', 'مسابقه', 'پروژه دانشجویی'],
  openGraph: { type: 'website', locale: 'fa_IR', siteName: 'یاقوت سمینار', title: 'یاقوت سمینار', description: 'مسابقه پروژه‌های دانشجویی سمینار' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#003049', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} dark`} suppressHydrationWarning>
      <head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
      <body className={`${vazirmatn.className} antialiased`}><ClientProviders>{children}</ClientProviders></body>
    </html>
  );
}
