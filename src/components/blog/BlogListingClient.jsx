'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { format } from 'date-fns'
import './blog-styles.css'

// Animated counter for stats
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0
        const end = value
        const duration = 2000
        const increment = end / (duration / 16)
        
        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)
        
        observer.disconnect()
      }
    })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="stat-number">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Category filter with magnetic hover effect
function CategoryFilter({ categories, activeCategory, onSelect }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const buttonsRef = useRef([])

  useEffect(() => {
    const activeIndex = activeCategory === 'all' 
      ? 0 
      : categories.findIndex(c => c.slug.current === activeCategory) + 1
    
    const button = buttonsRef.current[activeIndex]
    if (button) {
      setIndicatorStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      })
    }
  }, [activeCategory, categories])

  return (
    <nav className="category-nav-container">
      <div className="category-nav">
        <div className="category-indicator" style={indicatorStyle} />
        
        <button
          ref={el => buttonsRef.current[0] = el}
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelect('all')}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <span className="category-label">All Stories</span>
          <span className="category-count">{categories.reduce((acc, cat) => acc + (cat.count || 0), 0)}</span>
        </button>

        {categories.map((category, index) => (
          <button
            key={category.slug.current}
            ref={el => buttonsRef.current[index + 1] = el}
            className={`category-btn ${activeCategory === category.slug.current ? 'active' : ''}`}
            onClick={() => onSelect(category.slug.current)}
            onMouseEnter={() => setHoveredIndex(index + 1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="category-label">{category.title}</span>
            <span className="category-count">{category.count || 0}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Hero featured article with parallax
function FeaturedArticle({ post }) {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          setScrollY(window.scrollY * 0.5)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <article ref={heroRef} className="featured-article">
      <Link href={`/blog/${post.slug.current}`} className="featured-link">
        <div className="featured-image-container">
          <div 
            className="featured-parallax"
            style={{ transform: `translateY(${scrollY}px)` }}
          >
            {post.mainImage && (
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="featured-image"
                priority
                quality={90}
              />
            )}
          </div>
          <div className="featured-overlay" />
        </div>
        
        <div className="featured-content">
          <div className="featured-meta">
            {post.categories?.[0] && (
              <span className="featured-category">{post.categories[0].title}</span>
            )}
            <span className="featured-date">
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="featured-title">{post.title}</h1>
          
          {post.excerpt && (
            <p className="featured-excerpt">{post.excerpt}</p>
          )}
          
          <div className="featured-author">
            {post.author?.image && (
              <Image
                src={urlFor(post.author.image).url()}
                alt={post.author.name}
                width={48}
                height={48}
                className="author-avatar"
              />
            )}
            <div className="author-info">
              <span className="author-name">{post.author?.name}</span>
              <span className="read-time">{post.readTime || 5} min read</span>
            </div>
          </div>
          
          <span className="featured-cta">
            Read Article
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </Link>
    </article>
  )
}

// Masonry grid article card
function ArticleCard({ post, index, featured = false }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  return (
    <article 
      ref={cardRef}
      className={`article-card ${featured ? 'featured-card' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/blog/${post.slug.current}`} className="card-link">
        <div className="card-image-wrapper">
          {post.mainImage && (
            <>
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className={`card-image ${isHovered ? 'scaled' : ''}`}
                sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
              />
              <div className={`card-image-overlay ${isHovered ? 'visible' : ''}`} />
            </>
          )}
          
          {post.categories?.[0] && (
            <span className="card-category">{post.categories[0].title}</span>
          )}
        </div>
        
        <div className="card-content">
          <div className="card-meta">
            <span className="card-date">
              {format(new Date(post.publishedAt), 'MMM d, yyyy')}
            </span>
            <span className="card-dot">•</span>
            <span className="card-readtime">{post.readTime || 5} min</span>
          </div>
          
          <h2 className="card-title">{post.title}</h2>
          
          {post.excerpt && (
            <p className="card-excerpt">{post.excerpt}</p>
          )}
          
          <div className="card-footer">
            <span className="card-author">{post.author?.name || 'Shama Team'}</span>
            <span className={`card-arrow ${isHovered ? 'shifted' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

// Newsletter section with split layout
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pageOrigin: 'blog' }),
      })
      
      if (response.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-visual">
          <div className="newsletter-pattern" />
          <div className="newsletter-stats">
            <div className="stat-item">
              <AnimatedCounter value={2500} suffix="+" />
              <span className="stat-label">Subscribers</span>
            </div>
            <div className="stat-item">
              <AnimatedCounter value={48} />
              <span className="stat-label">Issues</span>
            </div>
          </div>
        </div>
        
        <div className="newsletter-content">
          <span className="section-eyebrow">Newsletter</span>
          <h2 className="newsletter-title">Rooted in Design</h2>
          <p className="newsletter-description">
            Bi-weekly insights on sustainable landscape architecture, 
            indigenous plants, and the future of Kenyan outdoor spaces.
          </p>
          
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className={`input-wrapper ${status}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'loading' || status === 'success'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? 'Subscribing...' : 
                 status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            
            {status === 'success' && (
              <p className="form-message success">Welcome to Rooted in Design!</p>
            )}
            {status === 'error' && (
              <p className="form-message error">Something went wrong. Please try again.</p>
            )}
          </form>
          
          <p className="newsletter-disclaimer">
            No spam. Unsubscribe anytime. Read our <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}

// Rooted by Shama community section
function CommunitySection() {
  return (
    <section className="community-section">
      <div className="community-container">
        <div className="community-header">
          <span className="section-eyebrow">Community</span>
          <h2 className="community-title">Rooted by Shama</h2>
          <p className="community-description">
            Share your landscape journey with us. From garden transformations 
            to questions about native plants—we'd love to hear from you.
          </p>
        </div>
        
        <div className="community-grid">
          <div className="community-card submit-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <h3>Submit Your Story</h3>
            <p>Share your landscape project, garden journey, or design questions.</p>
            <Link href="/blog/submit" className="community-link">
              Submit now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="community-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <h3>Ask a Question</h3>
            <p>Get expert advice on plants, maintenance, or design challenges.</p>
            <Link href="/contact" className="community-link">
              Contact us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="community-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <h3>Gallery</h3>
            <p>Browse community submissions and featured transformations.</p>
            <Link href="/projects" className="community-link">
              View gallery
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Blog Listing Component
export default function BlogListingClient({ featuredPost, posts, categories }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [displayedPosts, setDisplayedPosts] = useState(posts)

  // Add post counts to categories
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: posts.filter(post => 
      post.categories?.some(c => c.slug.current === cat.slug.current)
    ).length
  }))

  // Filter posts with animation delay
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      const filtered = activeCategory === 'all'
        ? posts
        : posts.filter(post => 
            post.categories?.some(cat => cat.slug.current === activeCategory)
          )
      setDisplayedPosts(filtered)
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeCategory, posts])

  // Separate featured from grid (if no featuredPost prop, use first post)
  const heroPost = featuredPost || displayedPosts[0]
  const gridPosts = featuredPost ? displayedPosts : displayedPosts.slice(1)

  return (
    <div className="journal-page">
      {/* Header */}
      <header className="journal-header">
        <div className="header-content">
          <span className="header-eyebrow">Shama Landscape Architects</span>
          <h1 className="header-title">Journal</h1>
          <p className="header-description">
            Exploring sustainable landscape design, indigenous flora, and the 
            art of creating meaningful outdoor spaces in East Africa.
          </p>
        </div>
        <div className="header-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryFilter 
        categories={categoriesWithCounts}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Featured Article */}
      {heroPost && activeCategory === 'all' && (
        <FeaturedArticle post={heroPost} />
      )}

      {/* Articles Grid */}
      <section className={`articles-section ${isLoading ? 'loading' : ''}`}>
        <div className="articles-container">
          <div className="section-header">
            <h2 className="section-title">
              {activeCategory === 'all' ? 'Latest Stories' : 
               categories.find(c => c.slug.current === activeCategory)?.title}
            </h2>
            <span className="article-count">{displayedPosts.length} articles</span>
          </div>
          
          <div className="articles-grid">
            {gridPosts.map((post, index) => (
              <ArticleCard 
                key={post._id} 
                post={post} 
                index={index}
                featured={index === 0 && activeCategory !== 'all'}
              />
            ))}
          </div>
          
          {gridPosts.length === 0 && (
            <div className="empty-state">
              <p>No articles found in this category.</p>
              <button onClick={() => setActiveCategory('all')}>
                View all articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* Community */}
      <CommunitySection />
    </div>
  )
}