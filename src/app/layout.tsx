import type { Metadata } from 'next'
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Navigation } from '@/components/Navigation'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['700'],
  display: 'swap'
})
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
})

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
      <body className={`${inter.variable} ${playfair.variable} ${plusJakarta.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navigation />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
