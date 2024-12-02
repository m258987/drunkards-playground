import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Shantell_Sans } from 'next/font/google'
import './globals.css'

const shantell = Shantell_Sans({
  variable: '--shantell',
  // we want the font to be loaded when we see the game ✨
  display: 'block',
  subsets: ['cyrillic-ext'],
})

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${shantell.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
