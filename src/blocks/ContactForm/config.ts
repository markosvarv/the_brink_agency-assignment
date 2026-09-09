import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: {
    singular: 'Contact Form Section',
    plural: 'Contact Form Sections',
  },
  fields: [
    {
      name: 'heading',
      label: 'Section Heading',
      type: 'text',
      defaultValue: 'Contact us',
    },
    {
      name: 'subheading',
      label: 'Section Subheading',
      type: 'text',
      defaultValue: 'Write us a message.',
    },
  ],
}
