import { writeClient } from '@/sanity/lib/client'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, pageOrigin } = body

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if already subscribed - use read client
    const { client } = await import('@/sanity/lib/client')
    const existing = await client.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email }
    )

    if (existing) {
      return Response.json({ success: true, message: 'Already subscribed' })
    }

    // Create subscription - USE WRITE CLIENT
    await writeClient.create({
      _type: 'newsletter',
      name: name || '',
      email,
      pageOrigin: pageOrigin || 'website',
      subscribedAt: new Date().toISOString(),
      status: 'active',
    })

    return Response.json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error in newsletter API:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}