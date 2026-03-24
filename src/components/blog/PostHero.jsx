'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

export default function PostHero({ post, variant = 'post' }) {
  const isFeatured = variant === 'featured'
  
  return (
    <header className={`post-hero ${isFeatured ? 'featured' : ''}`}>
      {/* CRITICAL: Must have position: relative for Next.js Image fill */}
      <div className="post-hero-image-wrapper" style={{ position: 'relative' }}>
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
        {isFeatured && post.excerpt && (
          <p className="hero-excerpt">{post.excerpt}</p>
        )}
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
          <span className="post-date">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
          {post.readTime && <span className="post-readtime">{post.readTime} min read</span>}
        </div>
        {isFeatured && (
          <Link href={`/blog/${post.slug.current}`} className="hero-cta">
            Read full article
          </Link>
        )}
      </div>
    </header>
  )
}