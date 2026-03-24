import { groq } from 'next-sanity'

// Blog Listing Queries
export const featuredPostQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc)[0]{
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    readTime,
    author->{name, image},
    categories[]->{title, slug}
  }
`

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    readTime,
    author->{name, image},
    categories[]->{title, slug}
  }
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    slug
  }
`

// Blog Post Detail Queries
export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    body,
    mainImage,
    publishedAt,
    readTime,
    author->{name, image},
    categories[]->{_id, title, slug},
    midArticleCTA{enabled, text, link},
    endCTA{enabled, text, link}
  }
`

// FIXED: Handle case when category is null/undefined
export const relatedPostsQuery = groq`
  *[_type == "post" && defined(categories) && categories[0]._ref == $category && _id != $currentId] | order(publishedAt desc)[0...3]{
    _id,
    title,
    slug,
    mainImage,
    readTime
  }
`