import { client } from '@/sanity/lib/client'
import BlogClient from './BlogClient'
import { Metadata } from 'next'

// Categories from your implementation document
const CATEGORIES = [
  'Sustainable Design',
  'Indigenous Plants', 
  'Urban Planning',
  'Garden Maintenance',
  'Commercial Landscaping',
  'Residential Design',
  'Water Conservation',
  'Soil Health'
]

// Fetch all posts with their categories and authors
async function getPosts() {
  const query = `*[_type == "post" && defined(slug.current)] | order(featured desc, priority asc, publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    readTime,
    featured,
    priority,
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    }
  }`
  
  return client.fetch(query, {}, { next: { revalidate: 60 } })
}

// Fetch all categories
async function getCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    title,
    slug,
    description
  }`
  
  return client.fetch(query, {}, { next: { revalidate: 3600 } })
}

export const metadata = {
  title: 'Blog | Shama Landscape Architects',
  description: 'Explore landscape design insights, sustainable practices, and inspiring projects from Shama Landscape Architects.',
}

export default async function BlogPage() {
  const posts = await getPosts()
  const categories = await getCategories()
  
  // Separate featured and regular posts
  const featuredPost = posts.find((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured || post._id !== featuredPost?._id)
  
  return (
    <BlogClient 
      featuredPost={featuredPost}
      posts={regularPosts}
      categories={categories.length > 0 ? categories : CATEGORIES.map(title => ({ title, slug: { current: title.toLowerCase().replace(/\s+/g, '-') } }))}
    />
  )
}