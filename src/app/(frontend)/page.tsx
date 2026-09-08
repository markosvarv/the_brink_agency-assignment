import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import HeroBlockComponent from '@/blocks/Hero/Component'

export default async function HomePage() {
  let heroProps: any = null

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // 1. Try fetching Hero Global from Payload CMS Admin
    try {
      const heroGlobal = await payload.findGlobal({
        slug: 'hero',
        depth: 2,
      })
      if (heroGlobal) {
        heroProps = heroGlobal
      }
    } catch {
      // Global schema might be initializing
    }

    // 2. Fall back or override with Pages collection hero block if configured
    try {
      const pagesResult = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: 'home' },
        },
        depth: 2,
      })

      const homePage = pagesResult.docs?.[0] || (await payload.find({ collection: 'pages', depth: 2 })).docs?.[0]

      if (homePage?.layout) {
        const heroBlock = homePage.layout.find((block: any) => block.blockType === 'hero')
        if (heroBlock) {
          heroProps = heroBlock
        }
      }
    } catch {
      // Pages collection fallback
    }
  } catch (err) {
    console.warn('Note: Payload CMS page fetch fallback:', err)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Dynamic Hero Component connected to Payload CMS */}
      <HeroBlockComponent
        badgeText={heroProps?.badgeText}
        heading={heroProps?.heading}
        supportingText={heroProps?.supportingText}
        ctaLabel={heroProps?.ctaLabel}
        ctaLink={heroProps?.ctaLink}
        secondaryCtaLabel={heroProps?.secondaryCtaLabel}
        secondaryCtaLink={heroProps?.secondaryCtaLink}
        mediaType={heroProps?.mediaType}
        backgroundImage={heroProps?.backgroundImage}
        backgroundVideo={heroProps?.backgroundVideo}
        backgroundVideoUrl={heroProps?.backgroundVideoUrl}
      />
    </div>
  )
}
