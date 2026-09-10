import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero Section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'badgeText',
      label: 'Badge / Tagline (Optional)',
      type: 'text',
      defaultValue: 'SERVICE & MANTAINANCE',
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
    },
    {
      name: 'ctaLabel',
      label: 'Call to Action Label (Optional)',
      type: 'text',
    },
    {
      name: 'ctaLink',
      label: 'Call to Action Link (Optional)',
      type: 'text',
    },
    {
      name: 'mediaType',
      label: 'Background Media Type',
      type: 'select',
      defaultValue: 'video',
      options: [
        { label: 'Video (MP4 / WebM)', value: 'video' },
        { label: 'Image', value: 'image' },
      ],
    },
    {
      name: 'backgroundImage',
      label: 'Background or Featured Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'backgroundVideo',
      label: 'Background Video (Upload to Media)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'backgroundVideoUrl',
      label: 'Background Video File / URL (MP4 / WebM)',
      type: 'text',
      defaultValue: '/ZWRT.mp4',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
  ],
}
