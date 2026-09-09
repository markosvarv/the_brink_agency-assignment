import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import HeroBlockComponent from '@/blocks/Hero/Component'
import ArticlesBlockComponent from '@/blocks/Articles/Component'

export default async function HomePage() {
  let heroProps: any = null
  let articlesBlockProps: any = null
  let fetchedArticles: any[] = []

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // 1. Fetch Hero Global from Payload CMS
    try {
      const heroGlobal = await payload.findGlobal({
        slug: 'hero',
        depth: 2,
      })
      if (heroGlobal) {
        heroProps = heroGlobal
      }
    } catch {
      // Global schema fallback
    }

    // 2. Fetch Pages collection home page blocks if configured
    try {
      const pagesResult = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: 'home' },
        },
        depth: 2,
      })

      const homePage = pagesResult.docs?.[0]
      if (homePage?.layout) {
        const heroBlock = homePage.layout.find((block: any) => block.blockType === 'hero')
        if (heroBlock) heroProps = heroBlock

        const articlesBlock = homePage.layout.find((block: any) => block.blockType === 'articles')
        if (articlesBlock) articlesBlockProps = articlesBlock
      }
    } catch {
      // Pages fallback
    }

    // 3. Query Articles collection from Payload CMS
    try {
      if (articlesBlockProps?.selectionType === 'manual' && Array.isArray(articlesBlockProps?.selectedArticles)) {
        fetchedArticles = articlesBlockProps.selectedArticles
      } else {
        const limit = articlesBlockProps?.limit || 6
        const articlesResult = await payload.find({
          collection: 'articles',
          sort: '-publishedAt',
          limit,
          depth: 2,
        })
        fetchedArticles = articlesResult.docs || []
      }
    } catch (err) {
      console.warn('Note: Articles fetch error:', err)
    }
  } catch (err) {
    console.warn('Note: Payload CMS page fetch error:', err)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 1. Dynamic Hero Component */}
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

      {/* 2. Dynamic Articles Section Component connected to Payload CMS */}
      <ArticlesBlockComponent
        heading={articlesBlockProps?.heading}
        headingMutedText={articlesBlockProps?.headingMutedText}
        buttonLabel={articlesBlockProps?.buttonLabel}
        buttonLink={articlesBlockProps?.buttonLink}
        articles={fetchedArticles}
      />
    </div>
  )
}
