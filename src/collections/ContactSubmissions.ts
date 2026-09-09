import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact Submission',
    plural: 'Contact Submissions',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'company', 'createdAt', 'isRead'],
    description: 'Inquiries submitted through the website contact form.',
  },
  // Ensure submission data is not publicly accessible through the API
  access: {
    // Only authenticated admins can read submissions
    read: ({ req: { user } }) => Boolean(user),
    // Disable public creation through the REST API; form submissions go through our secure /api/contact endpoint
    create: () => false,
    // Only authenticated admins can update (e.g. mark as read)
    update: ({ req: { user } }) => Boolean(user),
    // Only authenticated admins can delete
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
    },
    {
      name: 'phone',
      label: 'Telephone Number',
      type: 'text',
    },
    {
      name: 'email',
      label: 'E-mail Address',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'isRead',
      label: 'Mark as Read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'confirmationEmailSent',
      label: 'Confirmation Email Sent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'dailyDigestSent',
      label: 'Included in Daily Digest',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'ipAddress',
      label: 'Submitter IP Address',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
