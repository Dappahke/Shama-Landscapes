'use client'

import { useState } from 'react'

export default function RootedForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.target)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        setMessage('Thank you for your submission! We will review it soon.')
        e.target.reset()
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <section className="rooted-section">
      <div className="rooted-content">
        <h2>Rooted by Shama</h2>
        <p>
          Share your landscape journey with us. Whether it&apos;s a story, project showcase, 
          or question—we&apos;d love to hear from you.
        </p>
        <form onSubmit={handleSubmit} className="rooted-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="rooted-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="rooted-input"
            />
          </div>
          <select name="submissionType" required className="rooted-select">
            <option value="">Select submission type</option>
            <option value="story">Story</option>
            <option value="project">Project Showcase</option>
            <option value="question">Question</option>
            <option value="collaboration">Collaboration</option>
            <option value="other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Tell us your story..."
            required
            rows={5}
            className="rooted-textarea"
          />
          <input
            type="file"
            name="attachment"
            accept="image/*,.pdf,.doc,.docx"
            className="rooted-file"
          />
          <button type="submit" disabled={isSubmitting} className="rooted-btn">
            {isSubmitting ? 'Sending...' : 'Submit to Rooted by Shama'}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <p className="rooted-email">
          Or email us directly at{' '}
          <a href="mailto:editorial@shamalandscapes.co.ke">editorial@shamalandscapes.co.ke</a>
        </p>
      </div>
    </section>
  )
}