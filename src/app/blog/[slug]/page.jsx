import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

// Generate static params for all posts
export async function generateStaticParams() {
  const query = `*[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }`
  
  const posts = await client.fetch(query)
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Fetch single post by slug
async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    readTime,
    author->{
      name,
      slug,
      image,
      bio
    },
    categories[]->{
      title,
      slug
    },
    body,
    midArticleCTA,
    endCTA,
    relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      readTime,
      author->{name}
    },
    seo
  }`
  
  return client.fetch(query, { slug }, { next: { revalidate: 60 } })
}

// Fetch related posts by category if not manually set
async function getRelatedPostsByCategory(categorySlug, currentPostId, limit = 3) {
  const query = `*[_type == "post" && 
    _id != $currentPostId && 
    categories[]->slug.current == $categorySlug
  ] | order(priority asc, publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    readTime,
    author->{name}
  }`
  
  return client.fetch(query, { categorySlug, currentPostId, limit })
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Shama Landscape Architects',
    }
  }
  
  return {
    title: post.seo?.metaTitle || `${post.title} | Shama Landscape Architects Blog`,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }
  
  // Get related posts (manual or auto)
  let relatedPosts = post.relatedPosts || []
  
  if (relatedPosts.length === 0 && post.categories?.[0]) {
    relatedPosts = await getRelatedPostsByCategory(
      post.categories[0].slug.current,
      post._id,
      3
    )
  }
  
  return (
    <BlogPostClient 
      post={post}
      relatedPosts={relatedPosts}
    />
  )
}