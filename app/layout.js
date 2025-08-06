// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import HalkettNavbar from './components/halkett-navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'House of HALKETT - Premium Woodworking & Custom Solutions',
  description: 'Professional woodworking services, custom cabinetry, and precision craftsmanship.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#EFEEE1]">
          <HalkettNavbar />
          {children}
        </div>
      </body>
    </html>
  )
}