import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--pg-font-heading'
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
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable}`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
