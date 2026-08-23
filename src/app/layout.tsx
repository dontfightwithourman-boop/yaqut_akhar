import type { Metadata, Viewport } from 'next';
import LocalFont from 'next/font/local';
import './globals.css';
import ClientProviders from './providers';

const edameh = LocalFont({
  src: [
    { path: '../../public/fonts/edamehWeb-ExtraBlack.woff2', weight: '900' },
    { path: '../../public/fonts/edamehWeb-ExtraBlack.woff', weight: '900' },
  ],
  weight: '900',
  variable: '--font-edameh',
  display: 'swap',
});

const darbarehRegular = LocalFont({
  src: '../../public/fonts/darbarehWeb-Regular.woff2',
  weight: '400',
  variable: '--font-darbareh',
  display: 'swap',
});

const darbarehMedium = LocalFont({
  src: '../../public/fonts/darbarehWeb-Medium.woff2',
  weight: '500',
  variable: '--font-darbareh-medium',
  display: 'swap',
});

const darbarehSemiBold = LocalFont({
  src: '../../public/fonts/darbarehWeb-SemiBold.woff2',
  weight: '600',
  variable: '--font-darbareh-semibold',
  display: 'swap',
});

const darbarehBold = LocalFont({
  src: '../../public/fonts/darbarehWeb-Bold.woff2',
  weight: '700',
  variable: '--font-darbareh-bold',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران', template: '%s | مروارید سمینار' },
  description: 'چهلمین سمینار علوم و فنون - مدرسه راهنمایی علامه حلی 1 تهران',
  keywords: ['سمینار', 'مروارید', 'مسابقه', 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران'],
  openGraph: { type: 'website', locale: 'fa_IR', siteName: 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران', title: 'مروارید سمینار', description: 'چهلمین سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#003049', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${edameh.variable} ${darbarehRegular.variable} ${darbarehMedium.variable} ${darbarehSemiBold.variable} ${darbarehBold.variable} dark`} suppressHydrationWarning>
      <head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
      <body className={`${darbarehRegular.className} antialiased`}><ClientProviders>{children}</ClientProviders></body>
    </html>
  );
}
