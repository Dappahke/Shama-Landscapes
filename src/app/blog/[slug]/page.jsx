import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import imageUrlBuilder from '@sanity/image-url';
import BlogPostClient from "./BlogPostClient";

const builder = imageUrlBuilder(client);

function urlFor(source) {
  if (!source?.asset) return null;
  return builder.image(source);
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function estimateReadTime(content) {
  if (!content) return 5;
  const text = JSON.stringify(content);
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
}

async function getPost(slug) {
  if (!slug) return null;
  
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      publishedAt,
      excerpt,
      body,
      "slug": slug.current,
      mainImage { 
        asset->{ _id, url, metadata { lqip, dimensions } },
        alt
      },
      "category": categories[0]->{ title, "slug": slug.current },
      "author": author->{ 
        name, 
        bio, 
        "image": image.asset->{ url, metadata { lqip, dimensions } },
        "slug": slug.current 
      },
      "relatedPosts": *[_type == "post" 
        && references(^.categories[0]._ref) 
        && slug.current != $slug
        && defined(slug.current)
      ] | order(publishedAt desc) [0...3] {
        title, 
        "slug": slug.current, 
        publishedAt,
        excerpt,
        mainImage { 
          asset->{ url, metadata { lqip } } 
        }
      }
    }`;
    
    return await client.fetch(query, { slug }, { 
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  if (!slug) {
    return {
      title: 'Post Not Found | Blog',
      description: 'The requested blog post could not be found.'
    };
  }
  
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Blog',
      description: 'The requested blog post could not be found.'
    };
  }

  const imageUrl = post.mainImage?.asset ? urlFor(post.mainImage)?.width(1200)?.url() : null;

  return {
    title: `${post.title} | Rooted by Shama`,
    description: post.excerpt || `Read ${post.title} on Rooted by Shama`,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : undefined,
    }
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  if (!slug) {
    notFound();
  }
  
  const post = await getPost(slug);
  
  if (!post) notFound();

  // Pass all data to client component
  return <BlogPostClient post={post} />;
}