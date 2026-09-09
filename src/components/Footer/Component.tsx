'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export interface FooterProps {
  headline?: string | null
  newsletterPrompt?: string | null
  newsletterPlaceholder?: string | null
  newsletterButtonLabel?: string | null
  copyrightText?: string | null
  privacyLabel?: string | null
  privacyUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
  logoImageUrl?: string | null
}

const MENU_LINKS = [
  { label: 'Data centers', href: '#data-centers' },
  { label: 'Critical infrastructure', href: '#critical-infrastructure' },
  { label: 'Service', href: '#service' },
  { label: 'Smart & sustainable power', href: '#smart-power' },
  { label: 'About us', href: '#about' },
  { label: 'Careers', href: '#careers' },
]

export const FooterComponent: React.FC<FooterProps> = ({
  headline = 'When it matter most .',
  newsletterPrompt = 'Stay up to date on our news, projects and more',
  newsletterPlaceholder = 'Email address',
  newsletterButtonLabel = 'Sign up',
  copyrightText = 'Copyright © 2025',
  privacyLabel = 'Privacy',
  privacyUrl = '#privacy',
  instagramUrl = 'https://instagram.com',
  linkedinUrl = 'https://linkedin.com',
  logoImageUrl,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true)
    }
  }

  return (
    <footer className="w-full bg-black text-white border-t border-zinc-900 pt-20 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-20 lg:space-y-24">
        
        {/* Row 1: Headline (Left) & Newsletter Signup (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-white leading-[1.15] max-w-xl">
              {headline}
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <p className="text-sm text-zinc-400 font-normal">
              {newsletterPrompt}
            </p>

            {newsletterSubmitted ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm py-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-3">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={newsletterPlaceholder || 'Email address'}
                  className="flex-1 max-w-[280px] sm:max-w-[320px] px-4 py-2.5 rounded-lg bg-[#222226] border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1d61ef] hover:bg-blue-600 active:scale-95 text-white text-sm font-medium transition-all shadow-md shrink-0 text-center"
                >
                  {newsletterButtonLabel}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Row 2: Giant Logo (Left) & Menu + Legal/Socials (Right) */}
        {/* The logo is much bigger and placed directly left of the menu. */}
        {/* The Menu starts at the exact same horizontal position (lg:col-span-5) as the email box above. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Giant THE BRINK Logo directly left of the menu */}
          <div className="lg:col-span-7 flex items-center pt-2">
            <Link href="/" className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
              <img
                src={logoImageUrl || '/logo-large.png'}
                alt="THE BRINK"
                width={681}
                height={64}
                className="w-full max-w-[681px] h-auto object-contain block select-none"
              />
            </Link>
          </div>

          {/* Right Column: MENU Navigation + Legal & Socials */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-4">
                MENU
              </p>
              <ul className="space-y-2.5">
                {MENU_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-300 hover:text-white transition-colors font-normal inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Social Icons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-900">
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>{copyrightText}</span>
                {privacyLabel && (
                  <Link
                    href={privacyUrl || '#privacy'}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors hover:underline underline-offset-4"
                  >
                    {privacyLabel}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default FooterComponent
