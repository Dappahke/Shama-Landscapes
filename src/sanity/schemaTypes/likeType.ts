import {HeartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const likeType = defineType({
  name: 'like',
  title: 'Like',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: {type: 'post'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userIdentifier',
      title: 'User Identifier',
      type: 'string',
      description: 'Hashed IP + User Agent or Session ID for uniqueness',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      postTitle: 'post.title',
      createdAt: 'createdAt',
    },
    prepare({postTitle, createdAt}) {
      return {
        title: `Like on ${postTitle || 'Unknown post'}`,
        subtitle: new Date(createdAt).toLocaleString(),
      }
    },
  },
})