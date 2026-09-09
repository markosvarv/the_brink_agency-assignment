import type { Block } from 'payload'

export const ArticlesBlock: Block = {
  slug: 'articles',
  interfaceName: 'ArticlesBlock',
  labels: {
    singular: 'Articles Section',
    plural: 'Articles Sections',
  },
  fields: [
    {
      name: 'heading',
      label: 'Section Heading (White Leading Text)',
      type: 'text',
      defaultValue: "Energy's defining force in a changing",
    },
    {
      name: 'headingMutedText',
      label: 'Section Subheading (Muted Gray Text)',
      type: 'text',
      defaultValue: 'orem ipsum dolor sit amet, consectetur adipi scing elit, sed do eiusmod.',
    },
    {
      name: 'buttonLabel',
      label: 'Button Label',
      type: 'text',
      defaultValue: 'All news',
    },
    {
      name: 'buttonLink',
      label: 'Button Link',
      type: 'text',
      defaultValue: '#',
    },
    {
      name: 'selectionType',
      label: 'Article Selection Mode',
      type: 'select',
      defaultValue: 'latest',
      options: [
        { label: 'Automatically show latest articles', value: 'latest' },
        { label: 'Manually select specific articles', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      label: 'Number of Articles to Display (when set to Latest)',
      type: 'number',
      defaultValue: 2,
      admin: {
        condition: (_, siblingData) => siblingData?.selectionType === 'latest',
      },
    },
    {
      name: 'selectedArticles',
      label: 'Select Articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.selectionType === 'manual',
      },
    },
  ],
}
