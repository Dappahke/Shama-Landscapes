import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import imageUrlBuilder from '@sanity/image-url';

const SITE_URL = "https://shama.co.ke";
const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

// 1. DYNAMIC METADATA GENERATION
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        "ogImage": mainImage.asset->url,
        "keywords": categories[]->title,
        publishedAt,
        "category": categories[0]->title,
        "authorName": author->name
      }`,
      { slug }
    );

    if (!post) {
      return {
        title: "Post Not Found | Shama Landscape Architects",
      };
    }

    return {
      title: `${post.title} | Shama Kenya`,
      description: post.excerpt || `Read our latest insights on ${post.title}`,
      alternates: {
        canonical: `${SITE_URL}/blog/${slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/blog/${slug}`,
        siteName: "Shama Landscape Architects",
        images: post.ogImage ? [{ url: post.ogImage }] : [],
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Blog Post | Shama",
    };
  }
}

// 2. FETCH POST
async function getPost(slug) {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      publishedAt,
      excerpt,
      "readingTime": round(length(pt::text(body)) / 5 / 180),
      mainImage {
        asset->{
          url,
          metadata { lqip }
        }
      },
      body,
      "category": categories[0]->title,
      "author": author->{
        name,
        bio,
        "image": image.asset->url
      },
      "tags": categories[]->title,
      "relatedPosts": *[_type == "post" && references(^.categories[0]._ref) && slug.current != $slug] | order(publishedAt desc) [0...3] {
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        "readingTime": round(length(pt::text(body)) / 5 / 180),
        mainImage {
          asset->{
            url,
            metadata { lqip }
          }
        },
        "category": categories[0]->title
      }
    }
  `;
  
  try {
    return await client.fetch(query, { slug }, { 
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return null;
  }
}

// 3. SIMPLE PORTABLE TEXT COMPONENTS - NO MANIPULATION OF CHILDREN
const portableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-12">
          <div className="relative w-full overflow-hidden rounded-2xl aspect-video bg-stone-100">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Landscape design visual"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          {value.caption && (
            <figcaption className="px-4 mt-4 text-sm italic text-center text-stone-600">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-16 mb-6 text-3xl font-bold tracking-tight text-stone-900">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-stone-800">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-stone-800">{children}</h4>,
    normal: ({ children }) => <p className="mb-6 text-lg leading-relaxed text-stone-700">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="pl-6 my-10 text-xl italic border-l-4 border-emerald-500 text-stone-800">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="pl-6 mb-8 space-y-3 list-disc marker:text-emerald-600">{children}</ul>,
    number: ({ children }) => <ol className="pl-6 mb-8 space-y-3 list-decimal marker:font-medium marker:text-emerald-600">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      if (!value?.href) return <span>{children}</span>;
      const rel = !value.href.startsWith('/') ? 'noopener noreferrer' : undefined;
      const target = !value.href.startsWith('/') ? '_blank' : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          target={target}
          className="font-medium underline transition-colors decoration-emerald-500 underline-offset-4 text-emerald-700 hover:text-emerald-800"
        >
          {children}
        </a>
      );
    },
  },
};

// 4. MAIN COMPONENT
export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="min-h-screen bg-stone-50">
      {/* Simple breadcrumb */}
      <nav className="bg-white border-b border-stone-200">
        <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-stone-600">
            <li><Link href="/" className="hover:text-emerald-700">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-emerald-700">Journal</Link></li>
            <li>/</li>
            <li className="font-medium truncate text-emerald-700 max-w-50">{post.title}</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden text-white bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div className="relative max-w-4xl px-4 py-16 mx-auto sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <Link href="/blog" className="inline-flex items-center mb-8 text-sm font-medium text-emerald-100/90 hover:text-white">
              ← Back to Journal
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <span className="px-4 py-1.5 rounded-full bg-emerald-700/50 text-emerald-100 text-sm font-medium">
                  {post.category}
                </span>
              )}
              <div className="flex items-center gap-3 text-sm text-emerald-100/90">
                <time dateTime={post.publishedAt}>{publishedDate}</time>
                {post.readingTime && (
                  <>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </>
                )}
              </div>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-lg text-emerald-100/90">{post.excerpt}</p>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.mainImage && (
        <div className="max-w-6xl px-4 mx-auto -mt-12 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden shadow-2xl aspect-21/9 rounded-3xl ring-8 ring-white">
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={post.mainImage.asset.metadata.lqip}
              priority
            />
          </div>
        </div>
      )}

      {/* Content - Using default Portable Text rendering */}
      <div className="max-w-3xl px-4 mx-auto mt-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          {post.body && <PortableText value={post.body} components={portableTextComponents} />}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 mt-8 border-t border-stone-200">
            <h3 className="mb-4 text-sm font-semibold text-stone-500">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-4 py-2 text-sm rounded-full bg-stone-100 text-stone-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="px-4 py-16 mt-16 bg-white">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl font-bold text-center text-stone-900">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="group">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative mb-4 overflow-hidden aspect-16/10 rounded-2xl bg-stone-200">
                      {relatedPost.mainImage && (
                        <Image
                          src={relatedPost.mainImage.asset.url}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700">
                      {relatedPost.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

// 5. STATIC PATHS
export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(
      `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`
    );
    return slugs.map(({ slug }) => ({ slug }));
  } catch (error) {
    return [];
  }
}

export const revalidate = 3600;