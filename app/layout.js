// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import HalkettNavbar from './components/halkett-navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
 title: 'HALKETT - The Art of Walls | Luxury Modular Wall Systems & Premium Materials',
 description: 'Transform spaces with HALKETT\'s signature modular wall systems. Premium wood, leather, and metal finishes. Architectural panels, custom millwork, and luxury materials for discerning designers and architects. Request samples today.',
 keywords: 'luxury wall panels, modular wall systems, architectural millwork, premium wood panels, leather wall covering, metal wall cladding, custom wall solutions, high-end interior finishes, designer wall materials, HALKETT',
 openGraph: {
   title: 'HALKETT - The Art of Walls | Luxury Modular Wall Systems',
   description: 'Elevate your interiors with HALKETT\'s signature modular wall systems. Premium materials, precise craftsmanship, infinite possibilities.',
   url: 'https://www.houseofhalkett.com',
   siteName: 'House of HALKETT',
   images: [
     {
       url: '/images/halkett-og-image.jpg',
       width: 1200,
       height: 630,
       alt: 'HALKETT Luxury Wall Systems',
     }
   ],
   locale: 'en_US',
   type: 'website',
 },
 twitter: {
   card: 'summary_large_image',
   title: 'HALKETT - The Art of Walls',
   description: 'Luxury modular wall systems. Premium materials. Infinite possibilities.',
   images: ['/images/halkett-twitter-image.jpg'],
 },
 robots: {
   index: true,
   follow: true,
   googleBot: {
     index: true,
     follow: true,
     'max-video-preview': -1,
     'max-image-preview': 'large',
     'max-snippet': -1,
   },
 },
 verification: {
   google: 'your-google-verification-code',
 },
 alternates: {
   canonical: 'https://www.houseofhalkett.com',
 }
}

export default function RootLayout({ children }) {
 return (
   <html lang="en">
     <head>
       <link rel="icon" href="/favicon.ico" />
       <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
       <meta name="theme-color" content="#232320" />
       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
     </head>
     <body className={inter.className}>
       <div className="min-h-screen bg-[#EFEEE1]">
         <HalkettNavbar />
         {children}
       </div>
     </body>
   </html>
 )
}