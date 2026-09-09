'use client'

import React from 'react'
import Link from 'next/link'

export interface ArticleItem {
  id: string | number
  title: string
  slug: string
  category?: string | null
  shortDescription: string
  publishedAt?: string | null
  featuredImage?: {
    url?: string | null
    filename?: string | null
    alt?: string | null
  } | string | number | null
}

export interface ArticlesBlockProps {
  heading?: string | null
  headingMutedText?: string | null
  buttonLabel?: string | null
  buttonLink?: string | null
  articles?: ArticleItem[] | null
}

export const ArticlesBlockComponent: React.FC<ArticlesBlockProps> = ({
  heading = "Energy's defining force in a changing",
  headingMutedText = 'orem ipsum dolor sit amet, consectetur adipi scing elit, sed do eiusmod.',
  buttonLabel = 'All news',
  buttonLink = '#',
  articles = [],
}) => {
  // Format date helper matching exact Figma design: e.g. "30 July 2024"
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '30 July 2024'
    try {
      const d = new Date(dateStr)
      const day = d.getDate()
      const month = d.toLocaleString('en-US', { month: 'long' })
      const year = d.getFullYear()
      return `${day} ${month} ${year}`
    } catch {
      return '30 July 2024'
    }
  }

  // Safe image resolver if article card features an image
  const getImageUrl = (image: any): string | null => {
    if (image) {
      if (typeof image === 'object' && image !== null) {
        if (image.url) return image.url
        if (image.filename) return `/media/${image.filename}`
      }
      if (typeof image === 'number') return `/api/media/file/${image}`
      if (typeof image === 'string' && image.trim() !== '') {
        if (image.includes('/') || image.includes('.')) return image
        return `/api/media/file/${image}`
      }
    }
    return null
  }

  // Ensure at least 2 cards are always rendered side-by-side matching Figma design 1:1
  const sampleArticle: ArticleItem = {
    id: 'sample-2',
    title: 'Flex-e subsidy – solution for grid congestion',
    slug: 'flex',
    shortDescription:
      'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...',
    publishedAt: '2024-07-30T00:00:00.000Z',
    category: 'GRID CONGESTION',
  }

  let displayArticles: ArticleItem[] = articles && articles.length > 0 ? [...articles] : []
  if (displayArticles.length === 1) {
    displayArticles.push(sampleArticle)
  }

  return (
    <section className="w-full bg-black text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header (Matching Figma Design 1:1) */}
        <div className="space-y-6 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.2] tracking-tight">
            <span className="text-white">{heading} </span>
            {headingMutedText && (
              <span className="text-zinc-500/90 font-normal">{headingMutedText}</span>
            )}
          </h2>

          <div>
            <Link
              href={buttonLink || '#'}
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#1d61ef] hover:bg-blue-600 text-white text-sm font-medium transition-all shadow-md active:scale-95"
            >
              {buttonLabel || 'All news'}
            </Link>
          </div>
        </div>

        {/* Articles 2-Column Cards Grid (Matching Figma Design 1:1) */}
        {displayArticles && displayArticles.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 lg:gap-8 pt-4">
            {displayArticles.map((article, idx) => {
              const formattedDate = formatDate(article.publishedAt)
              const categoryTag = article.category || 'GRID CONGESTION'
              const articleUrl = `/articles/${article.slug}`
              const imgUrl = getImageUrl(article.featuredImage)

              return (
                <article
                  key={article.id || article.slug}
                  className="group bg-[#08080a] border border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Optional Featured Image if explicitly uploaded */}
                    {imgUrl && (
                      <div className="relative w-full h-44 rounded-lg overflow-hidden mb-4 bg-zinc-900">
                        <img
                          src={imgUrl}
                          alt={article.title}
                          className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Category Tag with Small Dot (• GRID CONGESTION) */}
                    <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-zinc-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block shrink-0" />
                      <span>{categoryTag}</span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-xl sm:text-[22px] font-normal text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      <Link href={articleUrl}>{article.title}</Link>
                    </h3>

                    {/* Short Description */}
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                      {article.shortDescription}
                    </p>
                  </div>

                  {/* Card Bottom Divider & Footer (Date + Right Arrow) */}
                  <div className="pt-6 mt-8 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-sm text-zinc-400 font-normal">{formattedDate}</span>

                    <Link
                      href={articleUrl}
                      className="text-white hover:text-cyan-400 transition-all p-1"
                      aria-label={`Read ${article.title}`}
                    >
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          /* Fallback Sample Card Display Matching Figma Design 1:1 */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 pt-4">
            <article className="group bg-[#08080a] border border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block shrink-0" />
                  <span>GRID CONGESTION</span>
                </div>
                <h3 className="text-xl sm:text-[22px] font-normal text-white leading-snug">
                  Flex-e subsidy – solution for grid congestion
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
                  The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-sm text-zinc-400 font-normal">30 July 2024</span>
                <span className="text-white text-lg">→</span>
              </div>
            </article>

            <article className="group bg-[#08080a] border border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block shrink-0" />
                  <span>GRID CONGESTION</span>
                </div>
                <h3 className="text-xl sm:text-[22px] font-normal text-white leading-snug">
                  Flex-e subsidy – solution for grid congestion
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
                  The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-sm text-zinc-400 font-normal">30 July 2024</span>
                <span className="text-white text-lg">→</span>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}

export default ArticlesBlockComponent
