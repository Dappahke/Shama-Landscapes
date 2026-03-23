import { writeClient } from '@/sanity/lib/client'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name')
    const email = formData.get('email')
    const submissionType = formData.get('submissionType')
    const message = formData.get('message')
    const attachment = formData.get('attachment')

    // Validate required fields
    if (!name || !email || !submissionType || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create submission document in Sanity
    const doc = {
      _type: 'submission',
      name,
      email,
      submissionType,
      message,
      status: 'new',
      submittedAt: new Date().toISOString(),
    }

    // Handle file attachment if present
    if (attachment && attachment.size > 0) {
      // Upload file to Sanity using write client
      const asset = await writeClient.assets.upload('file', attachment, {
        filename: attachment.name,
      })
      doc.attachment = {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      }
    }

    // Create document in Sanity using write client
    const result = await writeClient.create(doc)

    return new Response(
      JSON.stringify({ success: true, id: result._id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Submission error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to submit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}