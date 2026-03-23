import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        })
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary for blog cards and SEO (150-160 characters recommended)',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Mark as featured to appear in hero section',
      initialValue: false,
    }),
    defineField({
      name: 'priority',
      title: 'Priority Order',
      type: 'number',
      description: 'Lower numbers appear first (0-100)',
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated read time in minutes (auto-calculated if empty)',
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'midArticleCTA',
      title: 'Mid-Article CTA',
      type: 'object',
      description: 'Call-to-action inserted mid-article',
      fields: [
        defineField({
          name: 'text',
          title: 'CTA Text',
          type: 'string',
          initialValue: 'Thinking of creating a similar space?',
        }),
        defineField({
          name: 'link',
          title: 'CTA Link',
          type: 'string',
          initialValue: '/contact',
        }),
        defineField({
          name: 'enabled',
          title: 'Enable CTA',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'endCTA',
      title: 'End Article CTA',
      type: 'object',
      description: 'Call-to-action at end of article',
      fields: [
        defineField({
          name: 'text',
          title: 'CTA Text',
          type: 'string',
          initialValue: "Let's design your space",
        }),
        defineField({
          name: 'link',
          title: 'CTA Link',
          type: 'string',
          initialValue: '/contact',
        }),
        defineField({
          name: 'enabled',
          title: 'Enable CTA',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      description: 'Manually select related posts (auto-selected by category if empty)',
      of: [defineArrayMember({type: 'reference', to: {type: 'post'}})],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override default title for SEO',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Override default excerpt for SEO',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      featured: 'featured',
      priority: 'priority',
    },
    prepare(selection) {
      const {author, featured, priority} = selection
      return {
        ...selection,
        subtitle: `${featured ? '★ FEATURED • ' : ''}Priority: ${priority}${author ? ' • by ' + author : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Priority, New',
      name: 'priorityDesc',
      by: [
        {field: 'priority', direction: 'asc'},
        {field: 'publishedAt', direction: 'desc'},
      ],
    },
    {
      title: 'Published, New',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})