import React from 'react'
import HeroBlockComponent from '@/blocks/Hero/Component'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Reusable Hero Component based on Figma Design */}
      <HeroBlockComponent
        badgeText="SERVICE & MAINTENANCE"
        heading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui."
        supportingText="High quality industrial services and emergency maintenance available 24/7 across all regions."
        ctaLabel="Contact us"
        ctaLink="/contact"
      />
    </div>
  )
}
