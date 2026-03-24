'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.target)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          pageOrigin: 'blog',
        }),
      })
      
      if (response.ok) {
        setMessage('Thank you for subscribing!')
        e.target.reset()
      } else {
        setMessage('Subscription failed. Please try again.')
      }
    } catch (error) {
      setMessage('Subscription failed. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2>Stay Inspired</h2>
        <p>Subscribe to receive landscape design insights and project updates.</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="text"
            name="name"
            placeholder="Your name (optional)"
            className="newsletter-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="newsletter-input"
          />
          <button type="submit" disabled={isSubmitting} className="newsletter-btn">
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  )
}