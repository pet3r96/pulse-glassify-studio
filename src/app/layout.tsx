import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Navigation } from '@/components/Navigation'
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--pg-font-body' })
const outfit = Outfit({ subsets: ['latin'], variable: '--pg-font-heading' })

export const metadata: Metadata = {
  title: 'PulseStudio - Custom GoHighLevel Dashboard Themes',
  description: 'Transform your GoHighLevel dashboard with custom themes. Visual builder, marketplace, and instant deployment for agencies.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
