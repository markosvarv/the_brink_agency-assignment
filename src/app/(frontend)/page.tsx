import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import HeroBlockComponent from '@/blocks/Hero/Component'

export default async function HomePage() {
  let heroProps: any = null

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find the home page or the first available page in Payload CMS
    const pagesResult = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 2,
    })

    const homePage = pagesResult.docs?.[0] || (await payload.find({ collection: 'pages', depth: 2 })).docs?.[0]

    if (homePage?.layout) {
      // Find the hero block inside page layout
      const heroBlock = homePage.layout.find((block: any) => block.blockType === 'hero')
      if (heroBlock) {
        heroProps = heroBlock
      }
    }
  } catch (err) {
    console.warn('Note: Payload CMS page fetch fallback:', err)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Dynamic Hero Component connected to Payload CMS */}
      <HeroBlockComponent
        badgeText={heroProps?.badgeText ?? 'SERVICE & MAINTENANCE'}
        heading={
          heroProps?.heading ??
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.'
        }
        supportingText={
          heroProps?.supportingText ??
          'High quality industrial services and emergency maintenance available 24/7 across all regions.'
        }
        ctaLabel={heroProps?.ctaLabel ?? 'Contact us'}
        ctaLink={heroProps?.ctaLink ?? '/contact'}
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
