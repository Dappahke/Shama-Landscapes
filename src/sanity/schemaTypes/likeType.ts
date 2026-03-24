import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'like',
  title: 'Like',
  type: 'document',
  fields: [
    defineField({
      name: 'postId',
      title: 'Post ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postSlug',
      title: 'Post Slug',
      type: 'string',  // Changed from slug to string for simplicity
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})