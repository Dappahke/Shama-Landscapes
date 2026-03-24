import { writeClient } from '@/sanity/lib/client'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('postSlug')
  const sessionId = searchParams.get('sessionId')

  if (!postSlug) {
    return Response.json({ error: 'Missing postSlug' }, { status: 400 })
  }

  try {
    // Use regular client for reads (faster with CDN)
    const { client } = await import('@/sanity/lib/client')
    
    const likes = await client.fetch(
      `*[_type == "like" && postSlug == $postSlug]`,
      { postSlug }
    )
    
    const hasLiked = sessionId ? likes.some(like => like.sessionId === sessionId) : false

    return Response.json({
      totalLikes: likes.length,
      hasLiked,
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return Response.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { postId, postSlug, sessionId, action } = body

    if (!postId || !postSlug || !sessionId || !action) {
      return Response.json({ 
        error: 'Missing required fields',
      }, { status: 400 })
    }

    if (action === 'like') {
      // Check if already liked (use read client)
      const { client } = await import('@/sanity/lib/client')
      const existing = await client.fetch(
        `*[_type == "like" && postSlug == $postSlug && sessionId == $sessionId][0]`,
        { postSlug, sessionId }
      )

      if (existing) {
        return Response.json({ 
          success: true, 
          totalLikes: await getTotalLikes(postSlug),
          liked: true 
        })
      }

      // Create like - USE WRITE CLIENT
      await writeClient.create({
        _type: 'like',
        postId,
        postSlug,
        sessionId,
        createdAt: new Date().toISOString(),
      })

      return Response.json({ 
        success: true, 
        totalLikes: await getTotalLikes(postSlug),
        liked: true 
      })
    }

    if (action === 'unlike') {
      // Find and delete - USE WRITE CLIENT
      const { client } = await import('@/sanity/lib/client')
      const existing = await client.fetch(
        `*[_type == "like" && postSlug == $postSlug && sessionId == $sessionId][0]`,
        { postSlug, sessionId }
      )

      if (existing) {
        await writeClient.delete(existing._id)
      }

      return Response.json({ 
        success: true, 
        totalLikes: await getTotalLikes(postSlug),
        liked: false 
      })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in likes API:', error)
    return Response.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

async function getTotalLikes(postSlug) {
  const { client } = await import('@/sanity/lib/client')
  const likes = await client.fetch(
    `count(*[_type == "like" && postSlug == $postSlug])`,
    { postSlug }
  )
  return likes
}