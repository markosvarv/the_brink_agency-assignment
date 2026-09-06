import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'topBar',
      type: 'group',
      label: 'Top Announcement / Emergency Bar',
      fields: [
        {
          name: 'showTopBar',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Top Bar',
        },
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Emergency number – available 24/7',
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '0900 – 11 22 333',
        },
      ],
    },
    {
      name: 'logoText',
      type: 'text',
      defaultValue: 'THE BRINK',
      required: true,
    },
    {
      name: 'logoImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Show Search Button',
      defaultValue: true,
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Primary CTA Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Contact us',
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '#contact',
        },
      ],
    },
  ],
}
