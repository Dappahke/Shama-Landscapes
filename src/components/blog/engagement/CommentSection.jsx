'use client'

import { useState } from 'react'

export default function CommentSection({ 
  comments, 
  commentCount, 
  isOpen, 
  onToggle, 
  onSubmit 
}) {
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!newComment.name || !newComment.email || !newComment.content) return
    
    setIsSubmitting(true)
    const success = await onSubmit(newComment)
    setIsSubmitting(false)
    
    if (success) {
      setNewComment({ name: '', email: '', content: '' })
      alert('Comment submitted for moderation. Thank you!')
    }
  }

  return (
    <>
      <button 
        className="engagement-btn comment-btn"
        onClick={onToggle}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>

      {isOpen && (
        <section className="comments-section">
          <div className="comments-content">
            <h2>Comments ({commentCount})</h2>
            
            <form onSubmit={handleSubmit} className="comment-form">
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
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment-thread">
                    <div className="comment">
                      <div className="comment-header">
                        <strong>{comment.authorName}</strong>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                    {comment.replies?.map((reply) => (
                      <div key={reply._id} className="comment reply">
                        <div className="comment-header">
                          <strong>{reply.authorName}</strong>
                          <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
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
    </>
  )
}