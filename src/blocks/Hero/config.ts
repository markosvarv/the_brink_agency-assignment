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
      name: 'backgroundImage',
      label: 'Background or Featured Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
