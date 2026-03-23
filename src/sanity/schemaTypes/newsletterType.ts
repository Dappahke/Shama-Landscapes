import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsletterType = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'categoryInterest',
      title: 'Category Interest',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Sustainable Design', value: 'sustainable-design'},
          {title: 'Indigenous Plants', value: 'indigenous-plants'},
          {title: 'Urban Planning', value: 'urban-planning'},
          {title: 'Garden Maintenance', value: 'garden-maintenance'},
          {title: 'Commercial Landscaping', value: 'commercial-landscaping'},
          {title: 'Residential Design', value: 'residential-design'},
          {title: 'Water Conservation', value: 'water-conservation'},
          {title: 'Soil Health', value: 'soil-health'},
        ],
      },
    }),
    defineField({
      name: 'pageOrigin',
      title: 'Page Origin',
      type: 'string',
      description: 'Which page they subscribed from',
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Unsubscribed', value: 'unsubscribed'},
          {title: 'Bounced', value: 'bounced'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'name',
      status: 'status',
    },
    prepare({title, subtitle, status}) {
      return {
        title,
        subtitle: `${subtitle || 'No name'} • ${status}`,
      }
    },
  },
})