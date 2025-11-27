import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const interTight = Inter_Tight({ 
  subsets: ["latin"],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Opend'Or - AI Trading Agents",
  description: 'Create, customize, and deploy autonomous AI trading agents',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interTight.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
