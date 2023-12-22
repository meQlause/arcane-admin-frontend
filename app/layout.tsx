import type { Metadata } from 'next'
import { Inter, Maven_Pro } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from "./contexts/wallet-context";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const mavenPro = Maven_Pro({
  subsets: ['latin'],
  variable: '--font-maven-pro',
})

export const metadata: Metadata = {
  metadataBase: new URL(`http://arcane-frontend:3000`),
  title: {
    template: '%s - Arcane Labyrinth',
    default: 'Arcane Labyrinth',
  },
  description: `P2E Game project build on RadixDLT, has 4567 unique NFT characters that can be played in the game.`,
  openGraph: {
    title: {
      template: '%s - Arcane Labyrinth',
      default: 'Arcane Labyrinth',
    },
    description: `P2E Game project build on RadixDLT, has 4567 unique NFT characters that can be played in the game.`,
    images: '/og/main.jpeg',
  },
  keywords: ['game', 'p2e', 'radix', 'radixdlt', 'nft'],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: {
      url: '/brand/favicon.ico',
      type: 'image/x-icon',
      sizes: '16x16'
    },
    shortcut: '/brand/favicon.png',
    apple: '/brand/favicon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/brand/favicon.png',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    google: 'notranslate',
  },
}

export const viewport = {
  width: 'device-width',
  viewportFit: 'cover',
  minimumScale: 1,
  initialScale: 1,
  themeColor: 'white',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mavenPro.variable} font-inter bg-gray-50`}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
