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
  topBar?: {
    showTopBar?: boolean | null
    text?: string | null
    phone?: string | null
  } | null
  logoText: string
  logoImageUrl?: string | null
  navItems: NavItem[]
  showSearch?: boolean | null
  ctaButton?: {
    label?: string | null
    url?: string | null
  } | null
}

export default function HeaderClient({
  topBar,
  logoText,
  logoImageUrl,
  navItems = [],
  showSearch = true,
  ctaButton,
}: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Handle ESC key to close mobile menu & search overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock scroll when mobile menu or search overlay is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchOpen])

  const isLinkActive = (url: string) => {
    if (url === '/' && pathname === '/') return true
    if (url !== '/' && pathname.startsWith(url)) return true
    return false
  }

  const showTopBanner = topBar?.showTopBar !== false && (topBar?.text || topBar?.phone)

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 transition-all duration-300">
      
      {/* 1. Top Announcement / Emergency Bar */}
      {showTopBanner && (
        <div className="w-full bg-[#08080a] border-b border-zinc-800/60 py-1.5 px-4 text-center text-xs text-zinc-400 font-normal">
          <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-end gap-2">
            <span>{topBar?.text || 'Emergency number – available 24/7'}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mx-1" aria-hidden="true" />
            {topBar?.phone && (
              <a
                href={`tel:${topBar.phone.replace(/[^0-9+]/g, '')}`}
                className="text-zinc-200 hover:text-white font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded px-1"
              >
                {topBar.phone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Left) */}
          <Link
            href="/"
            className="flex items-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1 transition-opacity hover:opacity-90"
            aria-label={`${logoText} Home`}
          >
            {logoImageUrl ? (
              <img
                src={logoImageUrl}
                alt={logoText}
                style={{ width: '170.02px', height: '16px' }}
                className="object-contain"
              />
            ) : (
              <img
                src="/logo.svg"
                alt={logoText}
                style={{ width: '170.02px', height: '16px' }}
                className="object-contain"
              />
            )}
          </Link>

          {/* Navigation Links (Center) */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <ul className="flex items-center gap-8">
              {navItems.map((item, index) => {
                const active = isLinkActive(item.url)
                return (
                  <li key={item.id || index}>
                    <Link
                      href={item.url}
                      target={item.newTab ? '_blank' : undefined}
                      rel={item.newTab ? 'noopener noreferrer' : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-2 py-1 ${
                        active
                          ? 'text-white font-semibold underline underline-offset-8 decoration-cyan-400 decoration-2'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right Utilities (Search + Contact Us Button) */}
          <div className="hidden md:flex items-center gap-4">
            {showSearch && (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {ctaButton?.label && ctaButton?.url && (
              <Link
                href={ctaButton.url}
                className="px-6 py-2.5 rounded-full bg-zinc-700/80 hover:bg-zinc-600 text-white text-sm font-medium border border-zinc-600/50 hover:border-zinc-500 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
              >
                {ctaButton.label}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {showSearch && (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-[calc(5rem+2rem)] bg-zinc-950/98 backdrop-blur-2xl z-40 border-t border-zinc-800 flex flex-col justify-between p-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
        >
          <nav aria-label="Mobile Navigation" className="space-y-4">
            <ul className="flex flex-col gap-3">
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
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                        active
                          ? 'text-white bg-zinc-800 font-semibold border-l-4 border-cyan-400'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {ctaButton?.label && ctaButton?.url && (
            <div className="pt-6 border-t border-zinc-800">
              <Link
                href={ctaButton.url}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center px-6 py-3.5 rounded-full bg-zinc-700 text-white font-medium text-base shadow-md hover:bg-zinc-600 transition-all"
              >
                {ctaButton.label}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Search</h3>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); }}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, articles, pages..."
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-sm rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
