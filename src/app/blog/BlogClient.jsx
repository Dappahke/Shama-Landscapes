'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import './blog-styles.css'

export default function BlogClient({ featuredPost, posts, categories }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Filter posts by category
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => 
        post.categories?.some(cat => cat.slug.current === activeCategory)
      )

  // Handle Rooted by Shama submission
  const handleSubmission = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.target)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        setSubmitMessage('Thank you for your submission! We will review it soon.')
        e.target.reset()
      } else {
        setSubmitMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  // Handle newsletter subscription
  const handleNewsletter = async (e) => {
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
        setSubmitMessage('Thank you for subscribing!')
        e.target.reset()
      } else {
        setSubmitMessage('Subscription failed. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Subscription failed. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="blog-container">
      {/* Hero / Featured Article */}
      {featuredPost && (
        <section className="hero-section">
          <Link href={`/blog/${featuredPost.slug.current}`} className="hero-link">
            <div className="hero-image-wrapper">
              {featuredPost.mainImage && (
                <Image
                  src={urlFor(featuredPost.mainImage).url()}
                  alt={featuredPost.mainImage.alt || featuredPost.title}
                  fill
                  className="hero-image"
                  priority
                />
              )}
              <div className="hero-overlay" />
            </div>
            <div className="hero-content">
              {featuredPost.categories?.[0] && (
                <span className="hero-category">{featuredPost.categories[0].title}</span>
              )}
              <h1 className="hero-title">{featuredPost.title}</h1>
              {featuredPost.excerpt && (
                <p className="hero-excerpt">{featuredPost.excerpt}</p>
              )}
              <span className="hero-cta">Read full article</span>
            </div>
          </Link>
        </section>
      )}

      {/* Category Navigation */}
      <nav className="category-nav">
        <button
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.slug.current}
            className={`category-btn ${activeCategory === category.slug.current ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.slug.current)}
          >
            {category.title}
          </button>
        ))}
      </nav>

      {/* Blog Grid */}
      <section className="blog-grid">
        {filteredPosts.map((post, index) => (
          <article key={post._id} className={`blog-card ${index < 2 ? 'large' : ''}`}>
            <Link href={`/blog/${post.slug.current}`} className="card-link">
              <div className="card-image-wrapper">
                {post.mainImage && (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="card-image"
                  />
                )}
                {post.categories?.[0] && (
                  <span className="card-category">{post.categories[0].title}</span>
                )}
              </div>
              <div className="card-content">
                <h2 className="card-title">{post.title}</h2>
                {post.excerpt && (
                  <p className="card-excerpt">{post.excerpt}</p>
                )}
                <div className="card-meta">
                  {post.author && <span>{post.author.name}</span>}
                  {post.readTime && <span>{post.readTime} min read</span>}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Inspired</h2>
          <p>Subscribe to receive landscape design insights and project updates.</p>
          <form onSubmit={handleNewsletter} className="newsletter-form">
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
          {submitMessage && <p className="form-message">{submitMessage}</p>}
        </div>
      </section>

      {/* Rooted by Shama Section */}
      <section className="rooted-section">
        <div className="rooted-content">
          <h2>Rooted by Shama</h2>
          <p>
            Share your landscape journey with us. Whether it&apos;s a story, project showcase, 
            or question—we&apos;d love to hear from you.
          </p>
          <form onSubmit={handleSubmission} className="rooted-form">
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
          {submitMessage && <p className="form-message">{submitMessage}</p>}
          <p className="rooted-email">
            Or email us directly at{' '}
            <a href="mailto:editorial@shamalandscapes.co.ke">editorial@shamalandscapes.co.ke</a>
          </p>
        </div>
      </section>
    </div>
  )
}