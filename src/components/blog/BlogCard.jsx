'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

export default function BlogCard({ post, size = 'small' }) {
  return (
    <article style={{
      position: 'relative',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <Link href={`/blog/${post.slug.current}`} style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
      }}>
        {/* CRITICAL: position: relative here */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: size === 'large' ? '400px' : '240px',
          minHeight: '240px',
          overflow: 'hidden',
          backgroundColor: '#e0e0e0',
          flexShrink: 0,
        }}>
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.mainImage.alt || post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes={size === 'large' ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ddd',
              color: '#666',
            }}>
              <span>No Image</span>
            </div>
          )}
          {post.categories?.[0] && (
            <span style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: '#BD7563',
              color: 'white',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              zIndex: 2,
              borderRadius: '4px',
            }}>
              {post.categories[0].title}
            </span>
          )}
        </div>
        
        <div style={{
          padding: '24px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '20px',
            fontWeight: 300,
            lineHeight: 1.3,
            marginBottom: '12px',
            color: '#1a1a1a',
          }}>
            {post.title}
          </h2>
          <div style={{
            display: 'flex',
            gap: '16px',
            fontSize: '14px',
            color: '#999',
            marginTop: 'auto',
          }}>
            {post.author && <span>{post.author.name}</span>}
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}