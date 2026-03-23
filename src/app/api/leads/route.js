import { writeClient } from '@/sanity/lib/client'

export async function POST(request) {
  try {
    let body
    
    // Handle both JSON and Beacon API (which sends text/plain)
    const contentType = request.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      body = await request.json()
    } else {
      const text = await request.text()
      body = JSON.parse(text)
    }

    const { user, source, behavior, intent, message, createdAt } = body

    // Validate minimum required data
    if (!source || !source.postSlug) {
      return new Response(
        JSON.stringify({ error: 'Missing source information' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create lead document in Sanity using write client
    const leadDoc = {
      _type: 'lead',
      user: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      },
      source: {
        type: source.type || 'blog',
        postTitle: source.postTitle || '',
        postSlug: source.postSlug,
        category: source.category || '',
        pageOrigin: source.pageOrigin || '',
      },
      behavior: {
        timeOnPage: behavior?.timeOnPage || 0,
        scrollDepth: behavior?.scrollDepth || 0,
        clickedCTA: behavior?.clickedCTA || false,
        ctaType: behavior?.ctaType || null,
      },
      intent: intent || 'low',
      message: message || '',
      createdAt: createdAt || new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      status: 'new',
    }

    // Save to Sanity using write client
    const result = await writeClient.create(leadDoc)

    return new Response(
      JSON.stringify({ success: true, id: result._id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Lead tracking error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to track lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}