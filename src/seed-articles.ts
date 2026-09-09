import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  console.log('Seeding Figma sample articles into Payload CMS...')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const figmaArticles = [
    {
      title: 'Flex-e subsidy – solution for grid congestion',
      slug: 'flex-e-subsidy-solution-for-grid-congestion-1',
      shortDescription:
        'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...',
      publishedAt: new Date('2024-07-30T12:00:00.000Z').toISOString(),
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing down project delivery and scaling across industrial operations.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  text: 'Navigating Grid Capacity Constraints',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Through the Flex-e subsidy scheme, businesses receive technical and financial support to integrate local energy storage systems and smart load management algorithms.',
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: 'Flex-e subsidy – solution for grid congestion',
      slug: 'flex-e-subsidy-solution-for-grid-congestion-2',
      shortDescription:
        'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing...',
      publishedAt: new Date('2024-07-30T12:00:00.000Z').toISOString(),
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The energy transition is in full swing. More and more companies want to become more sustainable, but the limits of the electricity grid pose a barrier. Grid congestion is slowing down project delivery and scaling across industrial operations.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  text: 'Unlocking Smart Grid Infrastructure',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Innovative grid-sharing technologies allow industrial plants to optimize battery storage and demand-side response without exceeding substation thresholds.',
                },
              ],
            },
          ],
        },
      },
    },
  ]

  for (const articleData of figmaArticles) {
    try {
      const existing = await payload.find({
        collection: 'articles',
        where: { slug: { equals: articleData.slug } },
      })
      if (!existing.docs || existing.docs.length === 0) {
        await payload.create({
          collection: 'articles',
          data: articleData as any,
        })
        console.log(`Created article: ${articleData.title} (${articleData.slug})`)
      } else {
        console.log(`Article exists: ${articleData.slug}`)
      }
    } catch (e) {
      console.warn(`Error seeding article ${articleData.title}:`, e)
    }
  }

  console.log('Seeding completed successfully!')
  process.exit(0)
}

seed()
