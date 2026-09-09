import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact Section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      label: 'Section Heading',
      type: 'text',
      required: true,
      defaultValue: 'Contact us',
    },
    {
      name: 'subheading',
      label: 'Section Subheading / Prompt',
      type: 'text',
      defaultValue: 'Write us a message.',
    },
    {
      type: 'collapsible',
      label: 'Form Field Labels & Placeholders',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'nameLabel',
              label: 'Full Name Label',
              type: 'text',
              defaultValue: 'Full name',
              admin: { width: '50%' },
            },
            {
              name: 'namePlaceholder',
              label: 'Full Name Placeholder',
              type: 'text',
              defaultValue: 'Ilaria Casi',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'companyLabel',
              label: 'Company Label',
              type: 'text',
              defaultValue: 'Company',
              admin: { width: '50%' },
            },
            {
              name: 'companyPlaceholder',
              label: 'Company Placeholder',
              type: 'text',
              defaultValue: 'Enter company name',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'emailLabel',
              label: 'E-mail Address Label',
              type: 'text',
              defaultValue: 'E-mail address',
              admin: { width: '50%' },
            },
            {
              name: 'emailPlaceholder',
              label: 'E-mail Address Placeholder',
              type: 'text',
              defaultValue: 'Your e-mail',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phoneLabel',
              label: 'Telephone Number Label',
              type: 'text',
              defaultValue: 'Telephone number',
              admin: { width: '50%' },
            },
            {
              name: 'phonePlaceholder',
              label: 'Telephone Placeholder',
              type: 'text',
              defaultValue: '342 ..',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'messageLabel',
              label: 'Message Label',
              type: 'text',
              defaultValue: 'Message here',
              admin: { width: '50%' },
            },
            {
              name: 'messagePlaceholder',
              label: 'Message Placeholder',
              type: 'text',
              defaultValue: 'Write your message here',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'submitButtonLabel',
      label: 'Submit Button Text',
      type: 'text',
      defaultValue: 'Send message',
    },
    {
      type: 'collapsible',
      label: 'Success Screen Content',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'successTitle',
          label: 'Success Heading',
          type: 'text',
          defaultValue: 'Thank you for your message!',
        },
        {
          name: 'successMessage',
          label: 'Success Subtext',
          type: 'textarea',
          defaultValue:
            'We have successfully received your inquiry and dispatched an automated confirmation email. Our team will review your message and reach out shortly.',
        },
      ],
    },
  ],
}
