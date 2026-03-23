import { writeClient } from '@/sanity/lib/client'
import { headers } from 'next/headers'

// Get comments for a post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('postSlug')
    
    if (!postSlug) {
      return new Response(
        JSON.stringify({ error: 'Post slug required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Fetch approved comments with author info
    const query = `*[_type == "comment" && post->slug.current == $postSlug && status == "approved"] | order(createdAt desc) {
      _id,
      authorName,
      content,
      createdAt,
      parentComment->{_id, authorName}
    }`
    
    const comments = await writeClient.fetch(query, { postSlug })
    
    // Organize into threads (top-level and replies)
    const threads = comments.reduce((acc, comment) => {
      if (!comment.parentComment) {
        acc.topLevel.push({...comment, replies: []})
      } else {
        const parent = acc.topLevel.find(t => t._id === comment.parentComment._id)
        if (parent) {
          parent.replies.push(comment)
        }
      }
      return acc
    }, { topLevel: [] })

    return new Response(
      JSON.stringify({ comments: threads.topLevel, total: comments.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Get comments error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch comments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Create new comment
export async function POST(request) {
  try {
    const body = await request.json()
    const { postId, authorName, authorEmail, content, parentCommentId } = body
    
    // Validate required fields
    if (!postId || !authorName || !authorEmail || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get IP and user agent for spam detection
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Create comment document
    const commentDoc = {
      _type: 'comment',
      post: { _type: 'reference', _ref: postId },
      authorName,
      authorEmail,
      content,
      status: 'pending', // Requires moderation
      createdAt: new Date().toISOString(),
      ipAddress: ip,
      userAgent: userAgent,
    }

    // Add parent comment reference if it's a reply
    if (parentCommentId) {
      commentDoc.parentComment = { _type: 'reference', _ref: parentCommentId }
    }

    const result = await writeClient.create(commentDoc)

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result._id,
        message: 'Comment submitted for moderation' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Create comment error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to submit comment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}