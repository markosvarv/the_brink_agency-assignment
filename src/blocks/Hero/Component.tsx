import React from 'react'
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
    alt?: string | null
  } | string | null
  backgroundVideoUrl?: string | null
  backgroundVideo?: {
    url?: string | null
  } | string | null
}

export const HeroBlockComponent: React.FC<HeroProps> = ({
  badgeText = 'SERVICE & MAINTENANCE',
  heading = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.',
  supportingText,
  ctaLabel,
  ctaLink,
  secondaryCtaLabel,
  secondaryCtaLink,
  mediaType = 'image',
  backgroundImage,
  backgroundVideoUrl,
  backgroundVideo,
}) => {
  // Extract background image URL if object or string
  const imageUrl =
    typeof backgroundImage === 'object' && backgroundImage?.url
      ? backgroundImage.url
      : typeof backgroundImage === 'string'
        ? backgroundImage
        : null

  // Extract video URL if object or string
  const videoUrl =
    typeof backgroundVideo === 'object' && backgroundVideo?.url
      ? backgroundVideo.url
      : typeof backgroundVideo === 'string'
        ? backgroundVideo
        : backgroundVideoUrl || null

  const isVideoMode = mediaType === 'video' || Boolean(videoUrl)

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Layer: Video or Image */}
      {isVideoMode && videoUrl ? (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={imageUrl || undefined}
            className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.15]"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
          </video>
          {/* Subtle vignette overlay matching Figma design */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90" />
        </div>
      ) : imageUrl ? (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={
              (typeof backgroundImage === 'object' && backgroundImage?.alt) ||
              'Hero background'
            }
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.15]"
          />
          {/* Subtle vignette overlay matching Figma design */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90" />
        </div>
      ) : (
        /* Dark Metallic Machinery Graphic Background Fallback */
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-zinc-950 to-black" />
          {/* Subtle grid mesh */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      )}

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center gap-6">
        {/* Category Tagline / Badge (Matching Figma: SERVICE & MAINTENANCE) */}
        {badgeText && (
          <div className="inline-block px-3.5 py-1 text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-normal text-zinc-300 border border-zinc-700/60 bg-zinc-900/50 backdrop-blur-sm rounded-xs">
            {badgeText}
          </div>
        )}

        {/* Main Heading (Matching Figma: Clean white serif/sans typography) */}
        {heading && (
          <h1 className="text-3xl sm:text-5xl md:text-[56px] font-normal tracking-[-0.02em] leading-[1.2] text-white text-center max-w-4xl px-2">
            {heading}
          </h1>
        )}

        {/* Supporting Text */}
        {supportingText && (
          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl text-balance pt-2">
            {supportingText}
          </p>
        )}

        {/* Optional Action Buttons */}
        {(ctaLabel || secondaryCtaLabel) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-6">
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
