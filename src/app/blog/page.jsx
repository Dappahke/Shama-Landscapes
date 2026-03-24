import { client } from '@/sanity/lib/client'
import { featuredPostQuery, allPostsQuery, categoriesQuery } from '@/sanity/lib/queries'
import BlogListingClient from '@/components/blog/BlogListingClient'
import '@/components/blog/blog-styles.css'  // Fixed path - use @/ alias

export const metadata = {
  title: 'Journal | Shama Landscape Architects',
  description: 'Landscape design insights, project stories, and community features.',
}

export default async function BlogPage() {
  const [featuredPost, posts, categories] = await Promise.all([
    client.fetch(featuredPostQuery),
    client.fetch(allPostsQuery),
    client.fetch(categoriesQuery),
  ])

  return (
    <BlogListingClient 
      featuredPost={featuredPost} 
      posts={posts} 
      categories={categories}
    />
  )
}