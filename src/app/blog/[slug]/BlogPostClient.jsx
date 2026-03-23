'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import '../blog-styles.css'

// Generate or get session ID
function getSessionId() {
  if (typeof window === 'undefined') return null
  let sessionId = localStorage.getItem('shama_session_id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('shama_session_id', sessionId)
  }
  return sessionId
}

// Portable Text components
const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="article-image">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ''}
            width={800}
            height={600}
            className="content-image"
          />
          {value.alt && <figcaption>{value.alt}</figcaption>}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      const target = !value.href.startsWith('/') ? '_blank' : undefined
      return (
        <a href={value.href} rel={rel} target={target} className="article-link">
          {children}
        </a>
      )
    },
  },
  block: {
    h1: ({ children }) => <h1 className="article-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="article-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="article-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="article-h4">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="article-blockquote">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="article-paragraph">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="article-list">{children}</ul>,
    number: ({ children }) => <ol className="article-list numbered">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="article-list-item">{children}</li>,
    number: ({ children }) => <li className="article-list-item">{children}</li>,
  },
}

export default function BlogPostClient({ post, relatedPosts }) {
  const [scrollDepth, setScrollDepth] = useState(0)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [leadScore, setLeadScore] = useState('low')
  
  // Engagement states
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' })
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  
  const contentRef = useRef(null)
  const startTime = useRef(Date.now())
  const sessionId = useRef(getSessionId())

  // Fetch likes and comments on mount
  useEffect(() => {
    fetchEngagement()
  }, [])

  async function fetchEngagement() {
    try {
      // Fetch likes
      const likesRes = await fetch(`/api/likes?postSlug=${post.slug.current}&sessionId=${sessionId.current}`)
      const likesData = await likesRes.json()
      setLikes(likesData.totalLikes || 0)
      setHasLiked(likesData.hasLiked || false)

      // Fetch comments
      const commentsRes = await fetch(`/api/comments?postSlug=${post.slug.current}`)
      const commentsData = await commentsRes.json()
      setComments(commentsData.comments || [])
      setCommentCount(commentsData.total || 0)
    } catch (error) {
      console.error('Failed to fetch engagement:', error)
    }
  }

  // Toggle like
  async function toggleLike() {
    try {
      const action = hasLiked ? 'unlike' : 'like'
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          postSlug: post.slug.current,
          sessionId: sessionId.current,
          action,
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        setLikes(data.totalLikes)
        setHasLiked(data.liked)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  // Submit comment
  async function submitComment(e) {
    e.preventDefault()
    if (!newComment.name || !newComment.email || !newComment.content) return
    
    setIsSubmittingComment(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          authorName: newComment.name,
          authorEmail: newComment.email,
          content: newComment.content,
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        setNewComment({ name: '', email: '', content: '' })
        alert('Comment submitted for moderation. Thank you!')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    }
    setIsSubmittingComment(false)
  }

  // Share functions
  function shareOn(platform) {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=${text}&body=${url}`,
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    
    setShareMenuOpen(false)
  }

  // Track scroll depth and time
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      setScrollDepth(Math.max(scrollPercent, scrollDepth))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollDepth])

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000)
      setTimeOnPage(seconds)
      if (scrollDepth > 75 && seconds > 180) setLeadScore('high')
      else if (scrollDepth > 50 && seconds > 60) setLeadScore('medium')
    }, 1000)
    return () => clearInterval(interval)
  }, [scrollDepth])

  // Send lead data on unmount
  useEffect(() => {
    const sendLeadData = () => {
      const data = {
        user: { name: '', email: '' },
        source: {
          type: 'blog',
          postTitle: post.title,
          postSlug: post.slug.current,
          category: post.categories?.[0]?.title || '',
        },
        behavior: { timeOnPage, scrollDepth, clickedCTA: false },
        intent: leadScore,
        createdAt: new Date().toISOString(),
      }
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/leads', JSON.stringify(data))
      }
    }
    window.addEventListener('beforeunload', sendLeadData)
    return () => {
      window.removeEventListener('beforeunload', sendLeadData)
      sendLeadData()
    }
  }, [post, timeOnPage, scrollDepth, leadScore])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  return (
    <article className="blog-post" ref={contentRef}>
      {/* Hero Section */}
      <header className="post-hero">
        <div className="post-hero-image-wrapper">
          {post.mainImage && (
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="post-hero-image"
              priority
            />
          )}
          <div className="post-hero-overlay" />
        </div>
        <div className="post-hero-content">
          {post.categories?.[0] && (
            <span className="post-category">{post.categories[0].title}</span>
          )}
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            {post.author && (
              <div className="post-author">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="author-avatar"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            <span className="post-date">{formatDate(post.publishedAt)}</span>
            {post.readTime && <span className="post-readtime">{post.readTime} min read</span>}
          </div>
        </div>
      </header>

      {/* Engagement Bar */}
      <div className="engagement-bar">
        <div className="engagement-content">
          <button 
            className={`engagement-btn like-btn ${hasLiked ? 'liked' : ''}`}
            onClick={toggleLike}
            title={hasLiked ? 'Unlike' : 'Like'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
          </button>
          
          <button 
            className="engagement-btn comment-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
          </button>

          <div className="share-wrapper">
            <button 
              className="engagement-btn share-btn"
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>Share</span>
            </button>
            
            {shareMenuOpen && (
              <div className="share-menu">
                <button onClick={() => shareOn('twitter')}>Twitter</button>
                <button onClick={() => shareOn('facebook')}>Facebook</button>
                <button onClick={() => shareOn('linkedin')}>LinkedIn</button>
                <button onClick={() => shareOn('whatsapp')}>WhatsApp</button>
                <button onClick={() => shareOn('email')}>Email</button>
                <button onClick={() => shareOn('copy')}>Copy Link</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="post-content-wrapper">
        <div className="post-content">
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          
          {post.body && (
            <div className="article-body">
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}

          {/* Mid-Article CTA */}
          {post.midArticleCTA?.enabled && (
            <div className="mid-article-cta">
              <p>{post.midArticleCTA.text}</p>
              <Link href={post.midArticleCTA.link} className="cta-link">
                Start a similar project
              </Link>
            </div>
          )}

          {/* End CTA */}
          {post.endCTA?.enabled && (
            <div className="end-article-cta">
              <h3>{post.endCTA.text}</h3>
              <Link href={post.endCTA.link} className="cta-button">
                Let&apos;s design your space
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <section className="comments-section">
          <div className="comments-content">
            <h2>Comments ({commentCount})</h2>
            
            {/* Comment Form */}
            <form onSubmit={submitComment} className="comment-form">
              <h3>Leave a comment</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={newComment.email}
                  onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                  required
                />
              </div>
              <textarea
                placeholder="Share your thoughts..."
                rows={4}
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                required
              />
              <button type="submit" disabled={isSubmittingComment}>
                {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment-thread">
                    <div className="comment">
                      <div className="comment-header">
                        <strong>{comment.authorName}</strong>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                    {comment.replies?.map((reply) => (
                      <div key={reply._id} className="comment reply">
                        <div className="comment-header">
                          <strong>{reply.authorName}</strong>
                          <span>{formatDate(reply.createdAt)}</span>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts?.length > 0 && (
        <section className="related-posts">
          <div className="related-content">
            <h2>Related Articles</h2>
            <div className="related-grid">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost._id} className="related-card">
                  <Link href={`/blog/${relatedPost.slug.current}`}>
                    <div className="related-image-wrapper">
                      {relatedPost.mainImage && (
                        <Image
                          src={urlFor(relatedPost.mainImage).url()}
                          alt={relatedPost.mainImage.alt || relatedPost.title}
                          fill
                          className="related-image"
                        />
                      )}
                    </div>
                    <div className="related-card-content">
                      <h3>{relatedPost.title}</h3>
                      {relatedPost.readTime && <span>{relatedPost.readTime} min read</span>}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="lead-debug">
          Time: {timeOnPage}s | Scroll: {scrollDepth}% | Score: {leadScore}
        </div>
      )}
    </article>
  )
}