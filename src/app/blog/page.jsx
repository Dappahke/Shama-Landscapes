import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import "./blog-styles.css";

const SITE_URL = "https://shamalandscapes.co.ke";

// Enhanced SEO metadata with Kenya-specific keywords
export const metadata = {
  title: "Rooted by Shama | Landscape Architecture Journal Kenya",
  description: "Rooted by Shama — expert landscape architecture insights for Kenya. Discover sustainable garden design, urban planning trends, indigenous plants, and eco-friendly outdoor spaces in East Africa.",
  keywords: "landscape architecture Kenya, sustainable garden design Nairobi, indigenous plants East Africa, urban planning Kenya, eco-friendly landscaping, landscape architects Nairobi, Rooted by Shama",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Rooted by Shama | Landscape Architecture Journal",
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
        alt: "Rooted by Shama — Landscape Architecture Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rooted by Shama | Landscape Journal",
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

// Category-specific CTAs for strategic conversion
const categoryCTAs = {
  "sustainable-design": {
    title: "Ready for a Sustainable Landscape?",
    text: "Transform your outdoor space with eco-conscious design that thrives in Kenya's climate.",
    cta: "Explore Our Approach",
    link: "/approach",
    color: "shama-green"
  },
  "plant-guides": {
    title: "Need Expert Plant Selection?",
    text: "Get a custom plant palette tailored to your site conditions and maintenance preferences.",
    cta: "Request a Consultation",
    link: "/contact",
    color: "shama-terra"
  },
  "urban-planning": {
    title: "Planning a Commercial Development?",
    text: "We specialize in large-scale landscape architecture for developments across East Africa.",
    cta: "Discuss Your Project",
    link: "/contact",
    color: "shama-blue"
  },
  "residential": {
    title: "Dreaming of Your Perfect Garden?",
    text: "From concept to completion, we create outdoor spaces that reflect your lifestyle.",
    cta: "Start Your Project",
    link: "/contact",
    color: "shama-terra"
  },
  "maintenance": {
    title: "Protect Your Investment",
    text: "Professional landscape maintenance to keep your garden thriving year-round.",
    cta: "View Maintenance Plans",
    link: "/services/maintenance",
    color: "shama-green"
  }
};

// Fetch posts with categories
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
      "category": categories[0]->{
        title,
        slug
      },
      "author": author->{
        name,
        "image": image.asset->url
      },
      "relatedProjects": *[_type == "project" && references(^._id)] | order(_createdAt desc) [0...2] {
        title,
        slug,
        location,
        mainImage {
          asset->{ url }
        }
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

// Fetch all categories with post counts
async function getCategories() {
  const query = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      "count": count(*[_type == "post" && references(^._id)])
    }
  `;
  try {
    return await client.fetch(query, {}, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("Sanity Categories Fetch Error:", error);
    return [];
  }
}

// Fetch featured testimonial
async function getFeaturedTestimonial() {
  const query = `
    *[_type == "testimonial" && featured == true] [0] {
      quote,
      author,
      role,
      project->{
        title,
        slug
      }
    }
  `;
  try {
    return await client.fetch(query, {}, { next: { revalidate: 3600 } });
  } catch (error) {
    return null;
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
        name: "Rooted by Shama",
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
          articleSection: post.category?.title,
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
            name: "Rooted by Shama",
            item: `${SITE_URL}/blog`,
          },
        ],
      },
    ],
  };
}

// Generate local business schema
function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LandscapeArchitect",
    name: "Shama Landscape Architects",
    image: `${SITE_URL}/assets/shama_landscape_logo.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KE",
      addressRegion: "Nairobi",
      addressLocality: "Nairobi"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-1.2921",
      longitude: "36.8219"
    },
    url: SITE_URL,
    telephone: "+254-XXX-XXXXXX",
    priceRange: "$$$",
    areaServed: {
      "@type": "City",
      name: "Nairobi"
    },
    serviceType: ["Landscape Architecture", "Garden Design", "Urban Planning", "Landscape Maintenance"]
  };
}

export default async function BlogPage() {
  const [posts, categories, testimonial] = await Promise.all([
    getPosts(), 
    getCategories(),
    getFeaturedTestimonial()
  ]);
  
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const olderPosts = posts.slice(4);

  // Get CTA for featured post category
  const featuredCTA = featuredPost?.category?.slug?.current 
    ? categoryCTAs[featuredPost.category.slug.current] 
    : null;

  const jsonLd = generateStructuredData(posts);
  const localBusinessJsonLd = generateLocalBusinessSchema();

  return (
    <div className="rooted-journal">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      <main>
        {/* Navigation */}
        <nav className="journal-nav" aria-label="Breadcrumb">
          <div className="journal-container">
            <ol className="journal-breadcrumb">
              <li><Link href="/" className="journal-breadcrumb__link">Home</Link></li>
              <li className="journal-breadcrumb__sep">/</li>
              <li className="journal-breadcrumb__current">Rooted by Shama</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="journal-hero">
          <div className="journal-hero__bg">
            <Image
              src="/assets/journal-hero.jpg"
              alt="Sustainable Landscape Architecture in Kenya"
              fill
              priority
              className="journal-hero__image"
              sizes="100vw"
            />
            <div className="journal-hero__overlay" />
          </div>

          {/* SVG Root Decoration */}
          <div className="journal-hero__roots">
            <svg className="journal-roots__svg journal-roots__left" viewBox="0 0 200 400" preserveAspectRatio="none">
              <path d="M100,0 Q50,100 80,200 T60,400" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              <path d="M100,0 Q120,80 90,180 T100,400" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
            </svg>
            <svg className="journal-roots__svg journal-roots__right" viewBox="0 0 200 400" preserveAspectRatio="none">
              <path d="M100,0 Q150,100 120,200 T140,400" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              <path d="M100,0 Q80,80 110,180 T100,400" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
            </svg>
          </div>

          <div className="journal-hero__content">
            <div className="journal-logo">
              <span className="journal-logo__mark">R</span>
              <div className="journal-logo__text">
                <span className="journal-logo__title">Rooted</span>
                <span className="journal-logo__by">by Shama</span>
              </div>
            </div>

            <p className="journal-hero__tagline">
              Stories of sustainable landscapes, indigenous wisdom, and the future of outdoor spaces in East Africa
            </p>

            <div className="journal-hero__stats">
              <div className="journal-stat">
                <span className="journal-stat__number">{posts.length}</span>
                <span className="journal-stat__label">Stories</span>
              </div>
              <span className="journal-stat__divider" />
              <div className="journal-stat">
                <span className="journal-stat__number">{categories.length}</span>
                <span className="journal-stat__label">Topics</span>
              </div>
              <span className="journal-stat__divider" />
              <div className="journal-stat">
                <span className="journal-stat__number">500+</span>
                <span className="journal-stat__label">Readers</span>
              </div>
            </div>

            <div className="journal-scroll">
              <div className="journal-scroll__mouse">
                <div className="journal-scroll__wheel" />
              </div>
            </div>
          </div>
        </header>

        {/* Featured Post Section with Strategic CTA */}
        {featuredPost && (
          <section className="journal-section journal-featured">
            <div className="journal-container">
              <article className="journal-featured__card">
                <div className="journal-featured__wrapper">
                  <Link href={`/blog/${featuredPost.slug?.current}`} className="journal-featured__media-link">
                    <div className="journal-featured__media">
                      {featuredPost.mainImage ? (
                        <Image
                          src={featuredPost.mainImage.asset.url}
                          alt={featuredPost.title}
                          fill
                          className="journal-featured__img"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      ) : (
                        <div className="journal-featured__placeholder">Featured</div>
                      )}
                    </div>
                  </Link>
            
                  {featuredPost.category && (
                    <Link href={`/blog/category/${featuredPost.category.slug?.current}`} className="journal-featured__cat">
                      {featuredPost.category.title}
                    </Link>
                  )}
            
                  <div className="journal-featured__body">
                    <div className="journal-featured__meta">
                      <span className="journal-badge">Featured Story</span>
                      <time dateTime={featuredPost.publishedAt} className="journal-date">
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-KE', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </time>
                    </div>
              
                    <Link href={`/blog/${featuredPost.slug?.current}`} className="journal-featured__content-link">
                      <h2 className="journal-featured__title">{featuredPost.title}</h2>
                      <p className="journal-featured__excerpt">{featuredPost.excerpt}</p>
                    </Link>
                    
                    {/* Strategic CTA based on category */}
                    {featuredCTA && (
                      <div className="journal-featured__cta">
                        <p className="journal-featured__cta-text">{featuredCTA.text}</p>
                        <Link 
                          href={featuredCTA.link}
                          className={`journal-featured__cta-btn journal-featured__cta-btn--${featuredCTA.color}`}
                        >
                          {featuredCTA.cta}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    )}
                    
                    <div className="journal-featured__footer">
                      {featuredPost.author && (
                        <div className="journal-author">
                          <div className="journal-author__info">
                            <span className="journal-author__name">{featuredPost.author.name}</span>
                            <span className="journal-author__time">{featuredPost.readingTime} min read</span>
                          </div>
                        </div>
                      )}
                      <Link href={`/blog/${featuredPost.slug?.current}`} className="journal-featured__arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <section className="journal-section">
            <div className="journal-container">
              <div className="journal-section__header">
                <div>
                  <h2 className="journal-section__title">Latest Stories</h2>
                  <p className="journal-section__subtitle">Fresh perspectives on landscape design</p>
                </div>
              </div>
              
              <div className="journal-grid">
                {recentPosts.map((post, index) => (
                  <article key={post.slug?.current} className="journal-card" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="journal-card__media-container">
                      <Link href={`/blog/${post.slug?.current}`} className="journal-card__media-link">
                        <div className="journal-card__media">
                          {post.mainImage && (
                            <Image 
                              src={post.mainImage.asset.url} 
                              alt={post.title} 
                              fill 
                              className="journal-card__img" 
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          )}
                        </div>
                      </Link>
                      {post.category && (
                        <Link href={`/blog/category/${post.category.slug?.current}`} className="journal-card__cat">
                          {post.category.title}
                        </Link>
                      )}
                    </div>
                    
                    <div className="journal-card__body">
                      <div className="journal-card__meta">
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                      <Link href={`/blog/${post.slug?.current}`} className="journal-card__title-link">
                        <h3 className="journal-card__title">{post.title}</h3>
                      </Link>
                      <p className="journal-card__excerpt">{post.excerpt}</p>
                      
                      {/* Quick CTA for posts with related projects */}
                      {post.relatedProjects?.length > 0 && (
                        <Link 
                          href={`/projects/${post.relatedProjects[0].slug?.current}`}
                          className="journal-card__project-link"
                        >
                          <span>See in project: {post.relatedProjects[0].title}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Strategic Services Banner */}
        <section className="journal-services-banner">
          <div className="journal-container">
            <div className="journal-services-banner__content">
              <h2 className="journal-services-banner__title">Turn Inspiration into Reality</h2>
              <p className="journal-services-banner__text">
                Our journal shares our process. Our studio brings it to life. 
                Let's create something extraordinary together.
              </p>
              <div className="journal-services-banner__buttons">
                <Link href="/contact" className="journal-services-banner__btn journal-services-banner__btn--primary">
                  Start Your Project
                </Link>
                <Link href="/projects" className="journal-services-banner__btn journal-services-banner__btn--secondary">
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Archive / Older Posts */}
        {olderPosts.length > 0 && (
          <section className="journal-section journal-archive">
            <div className="journal-container">
              <div className="journal-archive__layout">
                <div className="journal-archive__sidebar">
                  <h2 className="journal-archive__title">From the Archive</h2>
                  <p className="journal-archive__desc">Deeper dives into landscape philosophy and project case studies.</p>
                  
                  {/* Testimonial in sidebar */}
                  {testimonial && (
                    <div className="journal-testimonial-mini">
                      <div className="journal-testimonial-mini__stars">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="journal-testimonial-mini__star" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="journal-testimonial-mini__quote">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="journal-testimonial-mini__author">
                        — {testimonial.author}, {testimonial.role}
                      </cite>
                    </div>
                  )}
                </div>
                
                <div className="journal-archive__list">
                  {olderPosts.map((post, index) => (
                    <article key={post.slug?.current} className="journal-archive__item">
                      <Link href={`/blog/${post.slug?.current}`} className="journal-archive__link">
                        <div className="journal-archive__thumb">
                          {post.mainImage && <Image src={post.mainImage.asset.url} alt={post.title} fill sizes="100px" />}
                        </div>
                        <div className="journal-archive__content">
                          <h3 className="journal-archive__heading">{post.title}</h3>
                          <time className="journal-archive__date" dateTime={post.publishedAt}>
                             {new Date(post.publishedAt).getFullYear()}
                          </time>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Categories & Newsletter sections */}
      <section className="journal-topics">
        <div className="journal-container">
          <div className="journal-topics__header">
            <h2>Browse by Category</h2>
            <p>Find insights tailored to your project type</p>
          </div>
          <div className="journal-topics__cloud">
            {categories.map((category) => (
              <Link 
                key={category._id} 
                href={`/blog/category/${category.slug?.current}`} 
                className="journal-topic"
              >
                {category.title} 
                {category.count > 0 && <span className="journal-topic__count">{category.count}</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="journal-newsletter">
        <div className="journal-container">
          <div className="journal-newsletter__content">
            <h2 className="journal-newsletter__title">Stay Rooted</h2>
            <p className="journal-newsletter__text">
              Join 500+ homeowners receiving monthly design tips. 
              <span className="journal-newsletter__highlight"> Free native plant guide</span> for new subscribers.
            </p>
            <form className="journal-newsletter__form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="journal-newsletter__input" 
                required 
              />
              <button type="submit" className="journal-newsletter__btn">Subscribe</button>
            </form>
            <p className="journal-newsletter__disclaimer">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}