import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="article-image" style={{ position: 'relative', width: '100%', height: 'auto' }}>
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ''}
            width={800}
            height={600}
            className="content-image"
            style={{ width: '100%', height: 'auto' }}  // Maintain aspect ratio
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