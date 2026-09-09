import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer Section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      label: 'Main Headline',
      type: 'text',
      defaultValue: 'When it matter most .',
      required: true,
    },
    {
      name: 'newsletterPrompt',
      label: 'Newsletter Prompt Text',
      type: 'text',
      defaultValue: 'Stay up to date on our news, projects and more',
    },
    {
      name: 'newsletterPlaceholder',
      label: 'Newsletter Input Placeholder',
      type: 'text',
      defaultValue: 'Email address',
    },
    {
      name: 'newsletterButtonLabel',
      label: 'Newsletter Button Text',
      type: 'text',
      defaultValue: 'Sign up',
    },
    {
      name: 'copyrightText',
      label: 'Copyright Notice',
      type: 'text',
      defaultValue: 'Copyright © 2025',
    },
    {
      name: 'privacyLabel',
      label: 'Privacy Policy Label',
      type: 'text',
      defaultValue: 'Privacy',
    },
    {
      name: 'privacyUrl',
      label: 'Privacy Policy URL',
      type: 'text',
      defaultValue: '#privacy',
    },
    {
      name: 'instagramUrl',
      label: 'Instagram URL',
      type: 'text',
      defaultValue: 'https://instagram.com',
    },
    {
      name: 'linkedinUrl',
      label: 'LinkedIn URL',
      type: 'text',
      defaultValue: 'https://linkedin.com',
    },
  ],
}
