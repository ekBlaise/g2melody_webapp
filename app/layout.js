import './globals.css'
import { Toaster } from 'sonner'
import { Dancing_Script, Nunito_Sans } from 'next/font/google'
import Providers from '@/components/providers'
import Chatbot from '@/components/chatbot'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
  adjustFontFallback: false,
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
  adjustFontFallback: false,
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
      <body className={`${nunitoSans.variable} ${dancingScript.variable} font-sans min-h-screen antialiased`}>
        <Providers>
          {children}
          <Chatbot />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
