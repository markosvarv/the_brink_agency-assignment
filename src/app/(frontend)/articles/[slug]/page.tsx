import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Render Lexical rich text or plain text string
function renderRichText(content: any) {
  if (!content) return null

  if (typeof content === 'string') {
    return <p className="text-zinc-300 leading-relaxed text-lg mb-6">{content}</p>
  }

  // Lexical AST renderer fallback
  if (content.root && Array.isArray(content.root.children)) {
    return content.root.children.map((child: any, idx: number) => {
      if (child.type === 'paragraph') {
        const text = child.children?.map((c: any) => c.text || '').join('') || ''
        return (
          <p key={idx} className="text-zinc-300 leading-relaxed text-lg mb-6">
            {text}
          </p>
        )
      }
      if (child.type === 'heading') {
        const Tag = (child.tag || 'h2') as keyof React.JSX.IntrinsicElements
        const text = child.children?.map((c: any) => c.text || '').join('') || ''
        return (
          <Tag key={idx} className="text-2xl sm:text-3xl font-semibold text-white mt-8 mb-4">
            {text}
          </Tag>
        )
      }
      return null
    })
  }

  return null
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  let article: any = null

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const result = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: slug },
      },
      depth: 2,
    })

    article = result.docs?.[0] || null
  } catch (err) {
    console.error('Error fetching article:', err)
  }

  if (!article) {
    notFound()
  }

  // Resolve featured image URL
  const resolveImageUrl = (img: any): string | null => {
    if (img) {
      if (typeof img === 'object' && img.url) return img.url
      if (typeof img === 'object' && img.filename) return `/media/${img.filename}`
      if (typeof img === 'number') return `/api/media/file/${img}`
      if (typeof img === 'string' && (img.includes('/') || img.includes('.'))) return img
    }
    return null
  }

  const imageUrl = resolveImageUrl(article.featuredImage)
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '30 July 2024'

  return (
    <article className="min-h-screen bg-zinc-950 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Article Header Meta */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              GRID CONGESTION
            </span>
            <span className="text-zinc-500 text-sm">{formattedDate}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-normal">
            {article.shortDescription}
          </p>
        </div>

        {/* Optional Featured Image */}
        {imageUrl && (
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent" />
          </div>
        )}

        {/* Main Article Content */}
        <div className="pt-6 border-t border-zinc-800/80 prose prose-invert max-w-none">
          {renderRichText(article.content) || (
            <p className="text-zinc-300 leading-relaxed text-lg">
              {article.shortDescription}
            </p>
          )}
        </div>

        {/* Footer Navigation CTA */}
        <div className="pt-12 border-t border-zinc-800/80 flex items-center justify-between">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-medium text-sm transition-all"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </article>
  )
}
