import type { Metadata, Viewport } from 'next'
import { Poppins } from "next/font/google"
import './globals.css'
import Provider from '@/providers/Provider';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
});

const defaultUrl = "https://arms-v4.vercel.app";
const title = 'ARMS | Academic Resource Management System';
const description = 'ARMS is an educational platform designed to empower students with easy access to study materials. Students can conveniently browse & download PDFs files.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ["chiragchrg", "chirag", "chrgchirag", "ARMS", "Arms-v4", "Academic", "Resource", "Management", "System", "armss", "chiruchirag2001"],
  authors: [{ name: "ChiragChrg" }, { url: "https://chiragchrg.netlify.app/" }],
  creator: "ChiragChrg",
  metadataBase: new URL(defaultUrl),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'TSsuy8j81zZ0Ge0aestKiwZUPydASWd9aANj-ITDack',
  },
  icons: {
    icon: '/icons/144.png',
    shortcut: '/favicon.svg',
    apple: '/icons/192.png',
  },
  openGraph: {
    title,
    description,
    url: defaultUrl,
    siteName: 'ARMS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${defaultUrl}/icons/192.png`,
        width: 192,
        height: 192,
        alt: 'ARMS Logo',
      },
      {
        url: `${defaultUrl}/icons/ARMSDevices.png`,
        width: 1800,
        height: 760,
        alt: 'ARMS Mockup Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@chrgchirag',
    images: [
      {
        url: `${defaultUrl}/icons/192.png`,
        width: 192,
        height: 192,
        alt: 'ARMS Logo',
      },
      {
        url: `${defaultUrl}/icons/ARMSDevices.png`,
        width: 1800,
        height: 760,
        alt: 'ARMS Mockup Preview',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: 'hsl(0 0% 100%)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider attribute="class" enableSystem storageKey='arms-theme'>
          {children}
        </Provider>
      </body>
    </html>
  )
}
