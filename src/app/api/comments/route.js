import { writeClient } from '@/sanity/lib/client'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('postSlug')

  if (!postSlug) {
    return Response.json({ error: 'Missing postSlug' }, { status: 400 })
  }

  try {
    const { client } = await import('@/sanity/lib/client')
    const comments = await client.fetch(
      `*[_type == "comment" && postSlug == $postSlug && approved == true] | order(createdAt desc)`,
      { postSlug }
    )

    return Response.json({
      comments,
      total: comments.length,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { postId, authorName, authorEmail, content } = body

    if (!postId || !authorName || !authorEmail || !content) {
      return Response.json({ 
        error: 'Missing required fields',
      }, { status: 400 })
    }

    // Get post slug from postId
    const { client } = await import('@/sanity/lib/client')
    const post = await client.fetch(`*[_id == $postId][0]{slug}`, { postId })
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create comment - USE WRITE CLIENT
    const comment = await writeClient.create({
      _type: 'comment',
      postId,
      postSlug: post.slug.current,
      authorName,
      authorEmail,
      content,
      approved: false,
      createdAt: new Date().toISOString(),
    })

    return Response.json({ 
      success: true, 
      comment: {
        _id: comment._id,
        authorName: comment.authorName,
        content: comment.content,
        createdAt: comment.createdAt,
      }
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return Response.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}