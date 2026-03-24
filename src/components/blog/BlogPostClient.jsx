'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import { ptComponents } from '@/lib/blog/portable-text-components'
import { useEngagement } from '@/hooks/useEngagement'
import { useLeadTracking } from '@/hooks/useLeadTracking'
import './blog-post-styles.css'

export default function BlogPostClient({ post, relatedPosts }) {
  const [showComments, setShowComments] = useState(false)
  const { likes, hasLiked, comments, commentCount, toggleLike, submitComment } = useEngagement(post.slug.current)
  const { scrollDepth, timeOnPage, leadScore } = useLeadTracking(post)

  return (
    <article className="blog-post">
      {/* Hero */}
      <header className="post-hero">
        <div className="post-hero-image">
          {post.mainImage && (
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.mainImage.alt || post.title}
              fill
              priority
              quality={90}
            />
          )}
          <div className="post-hero-overlay" />
        </div>
        
        <div className="post-hero-content">
          <div className="post-meta-top">
            {post.categories?.[0] && (
              <span className="post-category">{post.categories[0].title}</span>
            )}
            <span className="post-date">{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
          </div>
          
          <h1 className="post-title">{post.title}</h1>
          
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          
          <div className="post-author-bar">
            {post.author?.image && (
              <Image
                src={urlFor(post.author.image).url()}
                alt={post.author.name}
                width={56}
                height={56}
                className="author-image"
              />
            )}
            <div className="author-details">
              <span className="author-name">{post.author?.name}</span>
              <span className="read-time">{post.readTime || 5} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Engagement Bar */}
      <div className="engagement-bar">
        <div className="engagement-content">
          <button 
            className={`engagement-btn like-btn ${hasLiked ? 'liked' : ''}`}
            onClick={() => toggleLike(post._id)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{likes} likes</span>
          </button>
          
          <button 
            className="engagement-btn comment-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>{commentCount} comments</span>
          </button>

          <div className="share-dropdown">
            <button className="engagement-btn share-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="article-container">
        <div className="article-content">
          {post.body && (
            <div className="article-body">
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}

          {/* Mid Article CTA */}
          {post.midArticleCTA?.enabled && (
            <div className="inline-cta">
              <p>{post.midArticleCTA.text}</p>
              <Link href={post.midArticleCTA.link}>Start a project</Link>
            </div>
          )}

          {/* End CTA */}
          {post.endCTA?.enabled && (
            <div className="end-cta">
              <h3>{post.endCTA.text}</h3>
              <Link href={post.endCTA.link} className="cta-button">
                Get in touch
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <section className="comments-section">
          <div className="comments-container">
            <h2>Discussion ({commentCount})</h2>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const success = await submitComment(post._id, {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  content: formData.get('content')
                })
                if (success) {
                  e.target.reset()
                  alert('Comment submitted for moderation. Thank you!')
                }
              }}
              className="comment-form"
            >
              <h3>Add your thoughts</h3>
              <div className="form-row">
                <input name="name" placeholder="Name" required />
                <input name="email" type="email" placeholder="Email" required />
              </div>
              <textarea name="content" placeholder="Share your perspective..." rows={4} required />
              <button type="submit">Post Comment</button>
            </form>

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <strong>{comment.authorName}</strong>
                      <span>{format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts?.length > 0 && (
        <section className="related-section">
          <div className="related-container">
            <h2>Continue Reading</h2>
            <div className="related-grid">
              {relatedPosts.map((related) => (
                <Link 
                  key={related._id} 
                  href={`/blog/${related.slug.current}`}
                  className="related-card"
                >
                  <div className="related-image">
                    {related.mainImage && (
                      <Image
                        src={urlFor(related.mainImage).url()}
                        alt={related.title}
                        fill
                      />
                    )}
                  </div>
                  <h3>{related.title}</h3>
                  <span>{related.readTime || 5} min read</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          Time: {timeOnPage}s | Scroll: {scrollDepth}% | Score: {leadScore}
        </div>
      )}
    </article>
  )
}