import type { Metadata } from 'next'
import { Shantell_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const shantell = Shantell_Sans({
  variable: '--shantell',
  // we want the font to be loaded when we see the game ✨
  display: 'block',
  subsets: ['cyrillic-ext'],
})

export const metadata: Metadata = {
  title: {
    template: `%s | "Drunkard's playgorund"`,
    default: "Drunkard's playgorund",
  },
  description: "Drunkard's playground game by Faslin Kosta",
  applicationName: "Drunkard's playgorund",
  appleWebApp: true,
  creator: 'Faslin Kosta',
  authors: [
    { name: 'Faslin Kosta', url: 'https://faslin-kosta.com' },
    // todo fix
    { name: 'Tedy Kosta', url: 'https://faslin-kosta.com' },
  ],
  generator: 'Faslin Kosta Board and Imagination',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Drunkard" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body
        suppressHydrationWarning
        className={`${shantell.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
