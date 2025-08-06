'use client'
import Link from 'next/link'

export default function SimpleButton({ href, children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'inline-block px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-all duration-200 cursor-pointer'
  
  const variants = {
    primary: 'bg-[#B19359] text-white hover:bg-[#232320]',
    outline: 'bg-transparent border-2 border-current hover:bg-[#EFEEE1] hover:text-[#232320]'
  }
  
  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={combinedStyles} {...props}>
        {children}
      </Link>
    )
  }
  
  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  )
}