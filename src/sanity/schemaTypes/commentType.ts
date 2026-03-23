import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: {type: 'post'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorEmail',
      title: 'Author Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(2).max(1000),
    }),
    defineField({
      name: 'parentComment',
      title: 'Parent Comment (for replies)',
      type: 'reference',
      to: {type: 'comment'},
      description: 'Leave empty for top-level comments',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'content',
      authorName: 'authorName',
      postTitle: 'post.title',
      status: 'status',
    },
    prepare({title, authorName, postTitle, status}) {
      return {
        title: `${authorName} on ${postTitle || 'Unknown post'}`,
        subtitle: `${status} • ${title?.substring(0, 50)}${title?.length > 50 ? '...' : ''}`,
      }
    },
  },
})