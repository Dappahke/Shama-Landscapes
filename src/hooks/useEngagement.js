'use client'

import { useState, useEffect } from 'react'
import { getSessionId } from '@/lib/blog/session'

export function useEngagement(postSlug) {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const sessionId = getSessionId()

  useEffect(() => {
    if (postSlug) {
      fetchEngagement()
    }
  }, [postSlug])

  async function fetchEngagement() {
    try {
      // Build URL with or without sessionId
      let likesUrl = `/api/likes?postSlug=${postSlug}`
      if (sessionId) {
        likesUrl += `&sessionId=${sessionId}`
      }
      
      const [likesRes, commentsRes] = await Promise.all([
        fetch(likesUrl),
        fetch(`/api/comments?postSlug=${postSlug}`)
      ])
      
      const likesData = await likesRes.json()
      const commentsData = await commentsRes.json()
      
      setLikes(likesData.totalLikes || 0)
      setHasLiked(likesData.hasLiked || false)
      setComments(commentsData.comments || [])
      setCommentCount(commentsData.total || 0)
    } catch (error) {
      console.error('Failed to fetch engagement:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleLike(postId) {
    if (!sessionId) {
      console.error('No session ID available')
      return
    }

    try {
      const action = hasLiked ? 'unlike' : 'like'
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          postSlug,
          sessionId,
          action,
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        setLikes(data.totalLikes)
        setHasLiked(data.liked)
      } else {
        console.error('Like API error:', data.error)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  async function submitComment(postId, commentData) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: commentData.name,
          authorEmail: commentData.email,
          content: commentData.content,
        }),
      })
      
      const data = await res.json()
      return data.success
    } catch (error) {
      console.error('Failed to submit comment:', error)
      return false
    }
  }

  return {
    likes,
    hasLiked,
    comments,
    commentCount,
    loading,
    toggleLike,
    submitComment,
    refresh: fetchEngagement
  }
}