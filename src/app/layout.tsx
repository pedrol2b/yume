import '@/styles/globals.css'

import type { Metadata } from 'next'
import { type ReactNode } from 'react'

import { ThemeProvider } from '@/providers/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Yume - Dream',
  description:
    'Yume is a calming app designed for anxiety and panic relief, combining guided breathing techniques, grounding exercises, and affirmations in a clean and accessible experience.',
  keywords: [
    'mental health',
    'anxiety relief',
    'panic attack',
    'breathing exercise',
    'guided breathing',
    '478 breathing',
    'grounding technique',
    '54321 method',
    'mindfulness',
    'relaxation',
    'calming app',
    'stress relief',
    'meditation',
    'affirmations',
    'mantras',
    'emotional regulation',
    'self care',
    'pwa app',
    'offline support',
    'dark mode',
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [
    {
      name: 'Pedro Bueno',
      url: 'https://github.com/pedrol2b',
    },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Yume',
    startupImage: [
      {
        url: '/icon-512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Yume',
    title: 'Yume - Dream',
    description:
      'Yume is a calming app designed for anxiety and panic relief, combining guided breathing techniques, grounding exercises, and affirmations in a clean and accessible experience.',
  },
  twitter: {
    card: 'summary',
    title: 'Yume - Dream',
    description:
      'Yume is a calming app designed for anxiety and panic relief, combining guided breathing techniques, grounding exercises, and affirmations in a clean and accessible experience.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="color-scheme" content="light dark" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Yume" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Yume" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
