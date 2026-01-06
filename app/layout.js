import './globals.css'
import { Toaster } from 'sonner'
import Providers from '@/components/providers'

export const metadata = {
  title: 'G2 Melody | Choir Music Platform',
  description: 'G2 Melody - Excellence in Worship, Gospel Music, Community & Education. Based in Cameroon, Africa.',
  keywords: 'choir, gospel, worship, music, Cameroon, Africa, G2 Melody',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
