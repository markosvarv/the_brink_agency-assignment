'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

export interface HeroProps {
  badgeText?: string | null
  heading?: string | null
  supportingText?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaLink?: string | null
  mediaType?: 'image' | 'video' | string | null
  backgroundImage?: {
    url?: string | null
    filename?: string | null
    alt?: string | null
  } | string | null
  backgroundVideoUrl?: string | null
  backgroundVideo?: {
    url?: string | null
    filename?: string | null
  } | string | null
}

export const HeroBlockComponent: React.FC<HeroProps> = ({
  badgeText,
  heading,
  supportingText,
  ctaLabel,
  ctaLink,
  secondaryCtaLabel,
  secondaryCtaLink,
  mediaType = 'video',
  backgroundImage,
  backgroundVideoUrl = '/ZWRT.mp4',
  backgroundVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Safely resolve image or video URL from Payload Media object, number ID, or string path
  const resolveMediaUrl = (media: any, fallbackUrl?: string | null): string | null => {
    if (media) {
      if (typeof media === 'object' && media !== null) {
        if (media.filename) return `/media/${media.filename}`
        if (media.url) return media.url
      }
      if (typeof media === 'number') {
        return `/api/media/file/${media}`
      }
      if (typeof media === 'string' && media.trim() !== '') {
        if (media.includes('/') || media.includes('.')) return media
        return `/api/media/file/${media}`
      }
    }
    if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim() !== '') {
      return fallbackUrl
    }
    return null
  }

  const imageUrl = resolveMediaUrl(backgroundImage)
  const rawVideoUrl = resolveMediaUrl(backgroundVideo, backgroundVideoUrl) || '/ZWRT.mp4'

  // Video mode is enabled by default unless mediaType is explicitly 'image'
  const isVideoMode = (mediaType ? mediaType === 'video' : true) && Boolean(rawVideoUrl)
  const videoUrl = isVideoMode ? rawVideoUrl : null

  // Enforce browser autoplay policy (muted + playsInline + trigger play())
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.defaultMuted = true
      videoRef.current.muted = true
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser policy:', err)
        })
      }
    }
  }, [videoUrl])

  // Default texts matching Figma design:
  // Tagline: "SERVICE & MANTAINANCE" (13px, weight 400, uppercase, text-center)
  // Headline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui." (40px, weight 600, max-w-[800px])
  const defaultTagline = 'SERVICE & MANTAINANCE'
  const defaultHeadline = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.'

  let taglineText = defaultTagline
  let headlineText = defaultHeadline

  if (badgeText?.trim()) {
    taglineText = badgeText.trim()
    headlineText = heading?.trim() || supportingText?.trim() || defaultHeadline
  } else if (heading?.trim() && supportingText?.trim()) {
    taglineText = heading.trim()
    headlineText = supportingText.trim()
  } else if (heading?.trim()) {
    if (heading.trim().toUpperCase().includes('SERVICE')) {
      taglineText = heading.trim()
    } else {
      headlineText = heading.trim()
    }
  } else if (supportingText?.trim()) {
    headlineText = supportingText.trim()
  }

  return (
    <section className="relative w-full h-[850px] overflow-hidden flex flex-col items-center justify-center bg-black text-white px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
      {/* Background Layer: Video or Image */}
      {isVideoMode && videoUrl ? (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={imageUrl || undefined}
            className="w-full h-full object-cover object-center filter brightness-[0.85]"
          />
          {/* Subtle vignette overlay matching Figma design */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
        </div>
      ) : imageUrl ? (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={
              (typeof backgroundImage === 'object' && backgroundImage?.alt) ||
              'Hero background'
            }
            className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.1]"
          />
          {/* Vignette gradient overlay matching Figma design */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 pointer-events-none" />
        </div>
      ) : (
        /* Dark Metallic Machinery Graphic Background Fallback */
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/80 via-zinc-950 to-black" />
          {/* Subtle grid mesh */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      )}

      {/* Hero Content Box - Centered Vertically & Horizontally (Figma Specs: width: 1440, gap: 32px) */}
      <div className="relative z-20 max-w-[1440px] w-full mx-auto text-center flex flex-col items-center justify-center gap-[32px] pt-32 pb-20 my-auto px-4">
        {/* HEADING / TAGLINE (Figma Specs: width: 155, 13px, weight 400, line-height 120%, uppercase, text-center) */}
        {taglineText && (
          <div className="text-[13px] font-normal leading-[120%] tracking-wider text-center uppercase text-zinc-300 drop-shadow-md">
            {taglineText}
          </div>
        )}

        {/* SUPPORTING TEXT / BIG HEADLINE (Figma Specs: width: 800, 40px, font-semibold 600, line-height 120%, text-center) */}
        {headlineText && (
          <h1 className="w-full max-w-[800px] mx-auto text-2xl sm:text-[40px] font-semibold tracking-normal leading-[120%] text-white text-center drop-shadow-2xl">
            {headlineText}
          </h1>
        )}

        {/* Optional Action Buttons */}
        {(ctaLabel || secondaryCtaLabel) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-2">
            {ctaLabel && ctaLink && (
              <Link
                href={ctaLink}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-sm bg-zinc-200 hover:bg-white text-zinc-950 transition-all duration-200 shadow-md text-center"
              >
                {ctaLabel}
              </Link>
            )}

            {secondaryCtaLabel && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-sm bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 transition-all duration-200 text-center"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroBlockComponent
