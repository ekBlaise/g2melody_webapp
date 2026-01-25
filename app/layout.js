import './globals.css'
import { Toaster } from 'sonner'
import { Spectral, Lato } from 'next/font/google'
import Providers from '@/components/providers'
import Chatbot from '@/components/chatbot'

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spectral',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
})

export const metadata = {
  title: 'G2 Melody | Choir Music Platform',
  description: 'G2 Melody - Excellence in Worship, Gospel Music, Community & Education. Based in Cameroon, Africa.',
  keywords: 'choir, gospel, worship, music, Cameroon, Africa, G2 Melody',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${lato.variable} ${spectral.variable} font-sans min-h-screen antialiased`}>
        <Providers>
          {children}
          <Chatbot />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
