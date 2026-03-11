import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import NewsletterModal from "@/components/NewsletterModal";

const SITE_URL = "https://shamalandscapes.co.ke";

// Enhanced SEO metadata with Kenya-specific keywords
export const metadata = {
  title: "Landscape Architecture Blog Kenya | Sustainable Design Insights | Shama",
  description: "Expert landscape architecture insights for Kenya. Discover sustainable garden design, urban planning trends, indigenous plants, and eco-friendly outdoor spaces in East Africa.",
  keywords: "landscape architecture Kenya, sustainable garden design Nairobi, indigenous plants East Africa, urban planning Kenya, eco-friendly landscaping, landscape architects Nairobi",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Landscape Architecture & Design Journal | Shama Kenya",
    description: "Expert insights on sustainable landscape design, indigenous plants, and urban planning in Kenya and East Africa.",
    url: `${SITE_URL}/blog`,
    siteName: "Shama Landscape Architects",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/assets/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: "Shama Landscape Architects Blog - Sustainable Design in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Landscape Architecture Journal | Shama Kenya",
    description: "Sustainable design insights from Kenya's leading landscape architects.",
    images: [`${SITE_URL}/assets/og-blog.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Enhanced query with author and reading time
async function getPosts() {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      "readingTime": round(length(pt::text(body)) / 5 / 180),
      mainImage {
        asset->{
          url,
          metadata {
            lqip,
            dimensions
          }
        }
      },
      "category": categories[0]->title,
      "author": author->{
        name,
        "image": image.asset->url
      }
    }
  `;
  try {
    return await client.fetch(query, {}, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return [];
  }
}

// Generate structured data for rich snippets
function generateStructuredData(posts) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog`,
        name: "Shama Landscape Architects Journal",
        description: "Expert insights on sustainable landscape architecture and design in Kenya.",
        url: `${SITE_URL}/blog`,
        publisher: {
          "@type": "Organization",
          name: "Shama Landscape Architects",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/assets/shama_landscape_logo.png`,
          },
        },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${SITE_URL}/blog/${post.slug?.current}`,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          description: post.excerpt,
          author: post.author ? {
            "@type": "Person",
            name: post.author.name,
          } : undefined,
          image: post.mainImage?.asset?.url,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
        ],
      },
    ],
  };
}

export default async function BlogPage() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const olderPosts = posts.slice(4);

  const jsonLd = generateStructuredData(posts);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-stone-200">
        <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-stone-600">
            <li>
              <Link href="/" className="transition-colors hover:text-emerald-700">Home</Link>
            </li>
            <li aria-hidden="true" className="text-stone-400">/</li>
            <li aria-current="page" className="font-medium text-emerald-700">Journal</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <header className="relative overflow-hidden text-white bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" />
            <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="currentColor" className="opacity-50" />
          </svg>
        </div>
        
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-700/50 text-emerald-100 text-sm font-medium mb-6 border border-emerald-600/30">
              Insights & Inspiration
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Landscape Architecture <br />
              <span className="text-emerald-300">Journal Kenya</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed md:text-xl text-emerald-100/90">
              Expert perspectives on sustainable design, indigenous plants, and innovative 
              outdoor spaces shaping Kenyas built environment.
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-12 mx-auto space-y-16 max-w-7xl sm:px-6 lg:px-8">
        
        {/* Featured Post */}
        {featuredPost && (
          <section aria-label="Featured article">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-sm font-semibold tracking-wider uppercase text-stone-500">Featured Story</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            
            <article className="overflow-hidden transition-shadow duration-500 bg-white shadow-xl rounded-3xl hover:shadow-2xl">
              <Link href={`/blog/${featuredPost.slug?.current}`} className="grid gap-0 lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  {featuredPost.mainImage ? (
                    <Image
                      src={featuredPost.mainImage.asset.url}
                      alt={featuredPost.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-stone-200 text-stone-400">
                      Featured Image
                    </div>
                  )}
                  {featuredPost.category && (
                    <span className="absolute px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg top-6 left-6 bg-emerald-600">
                      {featuredPost.category}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-4 text-sm text-stone-500">
                    <time dateTime={featuredPost.publishedAt}>
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </time>
                    {featuredPost.readingTime && (
                      <>
                        <span>•</span>
                        <span>{featuredPost.readingTime} min read</span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="mb-4 text-3xl font-bold leading-tight transition-colors lg:text-4xl text-stone-900 hover:text-emerald-700">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="mb-8 text-lg leading-relaxed text-stone-600 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {featuredPost.author && (
                      <div className="flex items-center gap-3">
                        {featuredPost.author.image && (
                          <Image
                            src={featuredPost.author.image}
                            alt={featuredPost.author.name}
                            width={40}
                            height={40}
                            className="object-cover rounded-full"
                          />
                        )}
                        <span className="font-medium text-stone-900">{featuredPost.author.name}</span>
                      </div>
                    )}
                    
                    <span className="inline-flex items-center font-semibold text-emerald-700 group">
                      Read Article
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </section>
        )}

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <section aria-label="Recent articles">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-900">Latest Insights</h2>
              <Link href="/blog/archive" className="flex items-center gap-1 font-medium transition-colors text-emerald-700 hover:text-emerald-800">
                View Archive
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post, index) => (
                <article key={post.slug?.current} className="group">
                  <Link href={`/blog/${post.slug?.current}`} className="block">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-stone-200">
                      {post.mainImage ? (
                        <Image
                          src={post.mainImage.asset.url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-stone-400">
                          Shama
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute px-3 py-1 text-xs font-semibold rounded-full top-4 left-4 bg-white/90 backdrop-blur text-stone-800">
                          {post.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2 text-sm text-stone-500">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-KE', {
                          month: 'short', day: 'numeric'
                        })}
                      </time>
                      {post.readingTime && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-stone-300" />
                          <span>{post.readingTime} min read</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold leading-tight transition-colors text-stone-900 group-hover:text-emerald-700 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm leading-relaxed text-stone-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Older Posts List */}
        {olderPosts.length > 0 && (
          <section aria-label="More articles" className="p-8 bg-white border shadow-sm rounded-3xl lg:p-12 border-stone-100">
            <h2 className="mb-8 text-2xl font-bold text-stone-900">More from the Journal</h2>
            <div className="space-y-6">
              {olderPosts.map((post) => (
                <article key={post.slug?.current} className="pb-6 border-b group border-stone-100 last:border-0 last:pb-0">
                  <Link href={`/blog/${post.slug?.current}`} className="flex items-start gap-6">
                    <div className="relative flex-shrink-0 hidden w-24 h-24 overflow-hidden rounded-xl bg-stone-100 sm:block">
                      {post.mainImage ? (
                        <Image
                          src={post.mainImage.asset.url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-stone-400">
                          Image
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 text-sm text-stone-500">
                        <span className="font-medium text-emerald-700">{post.category}</span>
                        <span>•</span>
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-KE', {
                            month: 'long', year: 'numeric'
                          })}
                        </time>
                      </div>
                      <h3 className="text-lg font-bold transition-colors text-stone-900 group-hover:text-emerald-700 line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    
                    <svg className="flex-shrink-0 w-5 h-5 mt-1 transition-colors text-stone-300 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="py-20 text-center bg-white shadow-sm rounded-3xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100">
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-stone-900">Coming Soon</h3>
            <p className="text-stone-600">Our journal is being cultivated. Check back for fresh insights.</p>
          </div>
        )}
      </main>

      {/* Category Tags Section - SEO Enhancement */}
      <section className="py-16 text-white bg-emerald-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-center">Explore Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Sustainable Design', 'Indigenous Plants', 'Urban Planning', 'Garden Maintenance', 'Commercial Landscaping', 'Residential Design', 'Water Conservation', 'Soil Health'].map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-6 py-3 text-sm font-medium transition-colors border rounded-full bg-emerald-800/50 hover:bg-emerald-700 border-emerald-700/50"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterModal category="blog_main" postTitle="Blog Listing Page" />
    </div>
  );
}