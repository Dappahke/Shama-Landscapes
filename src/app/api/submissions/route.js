import { writeClient } from '@/sanity/lib/client'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name')
    const email = formData.get('email')
    const submissionType = formData.get('submissionType')
    const message = formData.get('message')
    const attachment = formData.get('attachment')

    if (!name || !email || !submissionType || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create submission - USE WRITE CLIENT
    const submission = {
      _type: 'submission',
      name,
      email,
      submissionType,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    if (attachment && attachment.size > 0) {
      submission.hasAttachment = true
      submission.attachmentName = attachment.name
    }

    await writeClient.create(submission)

    return Response.json({ success: true, message: 'Submission received' })
  } catch (error) {
    console.error('Error in submissions API:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}