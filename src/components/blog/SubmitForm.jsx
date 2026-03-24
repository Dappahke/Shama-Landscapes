'use client'

import { useState } from 'react'
import './submit-styles.css'

export default function SubmitForm({ categories }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')

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
        setSubmitStatus('success')
        e.target.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="submit-form">
      <div className="form-group">
        <label htmlFor="name">Your Name *</label>
        <input type="text" id="name" name="name" required />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input type="email" id="email" name="email" required />
      </div>
      
      <div className="form-group">
        <label htmlFor="submissionType">Submission Type *</label>
        <select id="submissionType" name="submissionType" required>
          <option value="">Select type...</option>
          <option value="story">Personal Story</option>
          <option value="project">Project Showcase</option>
          <option value="question">Design Question</option>
          <option value="collaboration">Collaboration Proposal</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Related Category</label>
        <select id="category" name="category">
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug.current}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Your Story *</label>
        <textarea 
          id="message" 
          name="message" 
          rows={6} 
          required
          placeholder="Tell us about your landscape journey..."
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="attachment">Attachments (optional)</label>
        <input 
          type="file" 
          id="attachment" 
          name="attachment" 
          accept="image/*,.pdf,.doc,.docx"
        />
        <span className="file-hint">Images, PDFs, or Word docs up to 10MB</span>
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={submitStatus}
      >
        {isSubmitting ? 'Sending...' : 
         submitStatus === 'success' ? 'Sent!' : 
         submitStatus === 'error' ? 'Try Again' : 
         'Submit Story'}
      </button>
      
      {submitStatus === 'success' && (
        <p className="success-message">
          Thank you! Your submission has been received and will be reviewed.
        </p>
      )}
      
      {submitStatus === 'error' && (
        <p className="error-message">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  )
}