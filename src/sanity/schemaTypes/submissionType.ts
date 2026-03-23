import {ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const submissionType = defineType({
  name: 'submission',
  title: 'Rooted by Shama Submission',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'submissionType',
      title: 'Submission Type',
      type: 'string',
      options: {
        list: [
          {title: 'Story', value: 'story'},
          {title: 'Project Showcase', value: 'project'},
          {title: 'Question', value: 'question'},
          {title: 'Collaboration', value: 'collaboration'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(10).max(2000),
    }),
    defineField({
      name: 'attachment',
      title: 'File Attachment',
      type: 'file',
      description: 'Optional image or document',
      options: {
        accept: 'image/*,.pdf,.doc,.docx',
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Reviewed', value: 'reviewed'},
          {title: 'Published', value: 'published'},
          {title: 'Declined', value: 'declined'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
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
      title: 'name',
      subtitle: 'submissionType',
      status: 'status',
    },
    prepare({title, subtitle, status}) {
      return {
        title: `${title} • ${subtitle}`,
        subtitle: `Status: ${status}`,
      }
    },
  },
})