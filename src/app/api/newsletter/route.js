import { client } from '@/sanity/lib/client'

export async function POST(request) {
  try {
    const body = await request.json()
    
    const { name, email, categoryInterest, pageOrigin } = body

    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if email already exists
    const existing = await client.fetch(
      `*[_type == "newsletterSubscriber" && email == $email][0]`,
      { email }
    )

    if (existing) {
      // Update existing subscriber if they want to add name or interests
      if (name || categoryInterest) {
        const updates = {}
        if (name && !existing.name) updates.name = name
        if (categoryInterest) updates.categoryInterest = categoryInterest
        
        if (Object.keys(updates).length > 0) {
          await client
            .patch(existing._id)
            .set(updates)
            .commit()
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Already subscribed', id: existing._id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create new subscriber document in Sanity
    const doc = {
      _type: 'newsletterSubscriber',
      name: name || '',
      email,
      categoryInterest: categoryInterest || [],
      pageOrigin: pageOrigin || 'unknown',
      status: 'active',
      subscribedAt: new Date().toISOString(),
    }

    const result = await client.create(doc)

    // Optional: Add to external email service (Brevo, Mailchimp, etc.)
    // await addToEmailService({ name, email, categoryInterest })

    return new Response(
      JSON.stringify({ success: true, id: result._id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}