'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavItem {
  id?: string
  label: string
  url: string
  newTab?: boolean | null
}

export interface HeaderClientProps {
  logoText: string
  logoImageUrl?: string | null
  navItems: NavItem[]
  ctaButton?: {
    label?: string | null
    url?: string | null
  } | null
}

export default function HeaderClient({
  logoText,
  logoImageUrl,
  navItems = [],
  ctaButton,
}: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const isLinkActive = (url: string) => {
    if (url === '/' && pathname === '/') return true
    if (url !== '/' && pathname.startsWith(url)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg p-1 transition-colors"
            aria-label={`${logoText} Home`}
          >
            {logoImageUrl ? (
              <img src={logoImageUrl} alt={logoText} className="h-9 w-auto object-contain" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
                B
              </div>
            )}
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <ul className="flex items-center gap-1">
              {navItems.map((item, index) => {
                const active = isLinkActive(item.url)
                return (
                  <li key={item.id || index}>
                    <Link
                      href={item.url}
                      target={item.newTab ? '_blank' : undefined}
                      rel={item.newTab ? 'noopener noreferrer' : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                        active
                          ? 'text-cyan-400 bg-cyan-500/10 font-semibold border border-cyan-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Desktop Call to Action Button */}
          {ctaButton?.label && ctaButton?.url && (
            <div className="hidden md:flex items-center">
              <Link
                href={ctaButton.url}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95"
              >
                {ctaButton.label}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-20 bg-slate-950/95 backdrop-blur-2xl z-40 border-t border-slate-800 flex flex-col justify-between p-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
        >
          <nav aria-label="Mobile Navigation" className="space-y-3">
            <ul className="flex flex-col gap-2">
              {navItems.map((item, index) => {
                const active = isLinkActive(item.url)
                return (
                  <li key={item.id || index}>
                    <Link
                      href={item.url}
                      target={item.newTab ? '_blank' : undefined}
                      rel={item.newTab ? 'noopener noreferrer' : undefined}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        active
                          ? 'text-cyan-400 bg-cyan-500/10 font-semibold border border-cyan-500/20'
                          : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Mobile CTA Button */}
          {ctaButton?.label && ctaButton?.url && (
            <div className="pt-6 border-t border-slate-800/80">
              <Link
                href={ctaButton.url}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center px-5 py-3.5 text-base font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {ctaButton.label}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
