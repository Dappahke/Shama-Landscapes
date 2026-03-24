import { client } from '@/sanity/lib/client'
import { postQuery, relatedPostsQuery } from '@/sanity/lib/queries'
import BlogPostClient from '@/components/blog/BlogPostClient'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ slug }`)
  return posts.map((post) => ({ slug: post.slug.current }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await client.fetch(postQuery, { slug })
  
  if (!post) {
    return {
      title: 'Not Found | Shama Landscape Architects',
    }
  }
  
  return {
    title: `${post.title} | Shama Landscape Architects`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await client.fetch(postQuery, { slug })
  
  // Handle post not found
  if (!post) {
    notFound()
  }
  
  // FIX: Only fetch related posts if post has categories
  let relatedPosts = []
  if (post.categories && post.categories.length > 0 && post.categories[0]?._ref) {
    relatedPosts = await client.fetch(relatedPostsQuery, { 
      category: post.categories[0]._ref,
      currentId: post._id 
    })
  }

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}