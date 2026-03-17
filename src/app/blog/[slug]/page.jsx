import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import imageUrlBuilder from '@sanity/image-url';
import { Suspense } from 'react';
import { ReadingProgress, ShareButtons, LikeButton, NewsletterForm } from './BlogPostClient';
import SubscribeSection from "@/components/SubscribeSection";

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
  if (!slug) {
    console.error('getPost called with empty slug');
    return null;
  }
  
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
    
    const result = await client.fetch(query, { slug }, { 
      next: { 
        revalidate: 3600,
        tags: [`post:${slug}`]
      } 
    });
    
    return result;
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
    title: `${post.title} | Blog`,
    description: post.excerpt || `Read ${post.title} on our blog`,
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

const ptComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset ? urlFor(value)?.width(1200)?.url() : null;
      if (!imageUrl) return null;
      
      return (
        <figure className="my-12 md:my-16 group">
          <div className="relative w-full overflow-hidden rounded-2xl aspect-[16/9] bg-stone-100">
            <Image 
              src={imageUrl} 
              alt={value.alt || ""} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              placeholder={value.asset?.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={value.asset?.metadata?.lqip}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-sm italic text-center text-stone-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      const target = !value.href.startsWith('/') ? '_blank' : undefined;
      return (
        <Link 
          href={value.href} 
          rel={rel} 
          target={target}
          className="text-[#3596D5] hover:text-[#BD7563] underline underline-offset-4 transition-colors"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-stone-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-stone-700">{children}</em>,
  },
  block: {
    h1: ({ children }) => (
      <h1 className="mt-16 mb-6 font-serif text-4xl font-bold leading-tight md:text-5xl text-stone-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} 
          className="mt-12 mb-6 font-serif text-3xl font-bold leading-tight md:text-4xl text-stone-900 scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 font-serif text-2xl font-bold leading-tight text-stone-800">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 mb-4 font-serif text-xl font-bold text-stone-800">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-relaxed text-stone-700 md:text-xl">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative my-12 py-8 px-8 md:px-12 bg-[#F5EBE8]/30 rounded-2xl border-l-4 border-[#BD7563]">
        <span className="absolute top-4 left-4 text-6xl text-[#BD7563]/20 font-serif leading-none">"</span>
        <p className="relative font-serif text-xl italic leading-relaxed md:text-2xl text-stone-800">
          {children}
        </p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2 ml-6 list-disc marker:text-[#BD7563]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 space-y-2 ml-6 list-decimal marker:text-[#BD7563] marker:font-semibold">
        {children}
      </ol>
    ),
  },
};

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HeartIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  if (!slug) {
    notFound();
  }
  
  const post = await getPost(slug);
  
  if (!post) notFound();

  const readTime = estimateReadTime(post.body);
  const formattedDate = formatDate(post.publishedAt);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage?.asset ? urlFor(post.mainImage)?.url() : undefined,
    datePublished: post.publishedAt,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
    } : undefined,
  };

  return (
    <>
      <ReadingProgress />
      
      <article className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="relative min-h-[60vh] md:min-h-[75vh] w-full flex items-end">
          <div className="absolute inset-0 z-0">
            {post.mainImage?.asset ? (
              <Image 
                src={urlFor(post.mainImage).width(1920).height(1080).url()} 
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                placeholder={post.mainImage.asset?.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={post.mainImage.asset?.metadata?.lqip}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#F5EBE8] to-[#E8D5CF]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>

          <div className="relative z-10 w-full px-6 py-16 md:py-24 md:px-12">
            <div className="max-w-5xl mx-auto">
              <nav className="mb-8">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-white/80 hover:text-white group"
                >
                  <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to Journal
                </Link>
              </nav>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {post.category && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[#BD7563] rounded-full">
                    {post.category.title}
                  </span>
                )}
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ClockIcon className="w-4 h-4" />
                  <span>{readTime} min read</span>
                  <span className="mx-2">•</span>
                  <time dateTime={post.publishedAt}>{formattedDate}</time>
                </div>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] max-w-4xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="max-w-2xl mt-6 text-lg leading-relaxed md:text-xl text-white/80">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="px-6 py-16 mx-auto max-w-7xl md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_320px] gap-12 lg:gap-16">
            
            <aside className="flex-col items-center hidden lg:flex">
              <div className="sticky top-32">
                <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
              </div>
            </aside>

            <main className="max-w-3xl">
              <div className="flex gap-4 pb-8 mb-8 border-b lg:hidden border-stone-100">
                <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
              </div>

              <div className="prose prose-lg prose-stone max-w-none">
                {post.body ? (
                  <PortableText 
                    value={post.body} 
                    components={ptComponents}
                  />
                ) : (
                  <p className="italic text-stone-500">No content available.</p>
                )}
              </div>

              <div className="flex flex-col items-start justify-between gap-6 py-10 mt-16 sm:flex-row sm:items-center border-y border-stone-100">
                <LikeButton postId={post._id} />
                
                <button className="px-6 py-3 text-sm font-semibold text-white transition-colors rounded-full bg-stone-900 hover:bg-stone-800">
                  Leave a comment
                </button>
              </div>

              {post.author && (
                <div className="mt-16 p-8 md:p-10 bg-gradient-to-br from-[#F5EBE8] to-white rounded-3xl border border-stone-100 shadow-sm">
                  <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
                    <div className="relative w-20 h-20 overflow-hidden rounded-full shadow-lg md:w-24 md:h-24 ring-4 ring-white shrink-0">
                      {post.author.image?.url ? (
                        <Image 
                          src={post.author.image.url} 
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#BD7563] flex items-center justify-center text-white text-2xl font-serif">
                          {post.author.name?.[0] || 'A'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 mb-3 md:flex-row md:items-center">
                        <h3 className="font-serif text-xl font-bold text-stone-900">
                          {post.author.name}
                        </h3>
                        <span className="hidden md:inline text-stone-300">•</span>
                        <span className="text-sm text-stone-500">Author</span>
                      </div>
                      {post.author.bio && (
                        <div className="text-sm leading-relaxed text-stone-600 md:text-base">
                          <PortableText value={post.author.bio} />
                        </div>
                      )}
                      {post.author.slug && (
                        <Link 
                          href={`/authors/${post.author.slug}`}
                          className="inline-block mt-4 text-sm font-semibold text-[#3596D5] hover:text-[#BD7563] transition-colors"
                        >
                          View all posts →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>

            <aside className="space-y-8 lg:space-y-12">
              <div className="relative p-8 overflow-hidden text-white bg-stone-900 rounded-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3596D5]/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h3 className="mb-3 font-serif text-2xl font-bold">Design Inquiries</h3>
                  <p className="mb-6 text-sm leading-relaxed text-stone-400">
                    Interested in creating ecological harmony in your space? Let&apos;s discuss your vision.
                  </p>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#3596D5] hover:text-white transition-colors group"
                  >
                    Start a Project
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>

              {post.relatedPosts?.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-6">
                    Related Stories
                  </h3>
                  <div className="space-y-8">
                    {post.relatedPosts.map((rel) => (
                      <article key={rel.slug}>
                        <Link 
                          href={`/blog/${rel.slug}`}
                          className="block group"
                        >
                          <div className="relative mb-4 overflow-hidden aspect-[4/3] rounded-2xl bg-stone-100">
                            {rel.mainImage?.asset ? (
                              <Image 
                                src={urlFor(rel.mainImage).width(400).height(300).url()} 
                                alt={rel.title}
                                fill
                                className="object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                                sizes="320px"
                              />
                            ) : (
                              <div className="w-full h-full bg-stone-200" />
                            )}
                          </div>
                          <time className="text-xs tracking-wider uppercase text-stone-400">
                            {formatDate(rel.publishedAt)}
                          </time>
                          <h4 className="mt-2 font-serif font-bold text-stone-900 group-hover:text-[#3596D5] transition-colors line-clamp-2">
                            {rel.title}
                          </h4>
                          {rel.excerpt && (
                            <p className="mt-2 text-sm text-stone-500 line-clamp-2">
                              {rel.excerpt}
                            </p>
                          )}
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <NewsletterForm />
            </aside>
          </div>
        </div>
      </article>

      <Suspense fallback={<div className="h-64 bg-stone-100" />}>
        <SubscribeSection />
      </Suspense>
    </>
  );
}