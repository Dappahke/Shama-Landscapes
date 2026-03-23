import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const leadType = defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'user',
      title: 'User Info',
      type: 'object',
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
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Source Type',
          type: 'string',
          initialValue: 'blog',
        }),
        defineField({
          name: 'postTitle',
          title: 'Post Title',
          type: 'string',
        }),
        defineField({
          name: 'postSlug',
          title: 'Post Slug',
          type: 'string',
        }),
        defineField({
          name: 'category',
          title: 'Category',
          type: 'string',
        }),
        defineField({
          name: 'pageOrigin',
          title: 'Page Origin',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'behavior',
      title: 'Behavior Metrics',
      type: 'object',
      fields: [
        defineField({
          name: 'timeOnPage',
          title: 'Time on Page (seconds)',
          type: 'number',
        }),
        defineField({
          name: 'scrollDepth',
          title: 'Scroll Depth (%)',
          type: 'number',
        }),
        defineField({
          name: 'clickedCTA',
          title: 'Clicked CTA',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'ctaType',
          title: 'CTA Type',
          type: 'string',
          options: {
            list: [
              {title: 'Mid-Article', value: 'mid-article'},
              {title: 'End Article', value: 'end-article'},
              {title: 'Newsletter', value: 'newsletter'},
              {title: 'Rooted by Shama', value: 'rooted'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'intent',
      title: 'Intent Score',
      type: 'string',
      options: {
        list: [
          {title: 'Low', value: 'low'},
          {title: 'Medium', value: 'medium'},
          {title: 'High', value: 'high'},
        ],
        layout: 'radio',
      },
      initialValue: 'low',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Lead Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Qualified', value: 'qualified'},
          {title: 'Converted', value: 'converted'},
          {title: 'Lost', value: 'lost'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'source.postTitle',
      subtitle: 'intent',
      status: 'status',
      name: 'user.name',
      email: 'user.email',
    },
    prepare({title, subtitle, status, name, email}) {
      const displayName = name || email || 'Anonymous'
      return {
        title: `${displayName} • ${title || 'Unknown post'}`,
        subtitle: `Intent: ${subtitle} • Status: ${status}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Intent (High to Low)',
      name: 'intentDesc',
      by: [{field: 'intent', direction: 'desc'}],
    },
  ],
})