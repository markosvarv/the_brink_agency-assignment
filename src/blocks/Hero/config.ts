import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'badgeText',
      label: 'Badge / Tagline (Optional)',
      type: 'text',
      defaultValue: 'SERVICE & MAINTENANCE',
    },
    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      required: true,
      defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dui.',
    },
    {
      name: 'supportingText',
      label: 'Supporting Text (Optional)',
      type: 'textarea',
      defaultValue:
        'High quality industrial services and emergency maintenance available 24/7 across all regions.',
    },
    {
      name: 'ctaLabel',
      label: 'Call to Action Label (Optional)',
      type: 'text',
      defaultValue: 'Contact us',
    },
    {
      name: 'ctaLink',
      label: 'Call to Action Link (Optional)',
      type: 'text',
      defaultValue: '/contact',
    },
    {
      name: 'secondaryCtaLabel',
      label: 'Secondary CTA Label (Optional)',
      type: 'text',
      defaultValue: 'Contact Us',
    },
    {
      name: 'secondaryCtaLink',
      label: 'Secondary CTA Link (Optional)',
      type: 'text',
      defaultValue: '/contact',
    },
    {
      name: 'mediaType',
      label: 'Background Media Type',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video (MP4 / WebM)', value: 'video' },
      ],
    },
    {
      name: 'backgroundImage',
      label: 'Background Image / Video Poster',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'backgroundVideoUrl',
      label: 'Background Video File / URL (MP4 / WebM)',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'backgroundVideo',
      label: 'Upload Background Video (Media Collection)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
  ],
}
