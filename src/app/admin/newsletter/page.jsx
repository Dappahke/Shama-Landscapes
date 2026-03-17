"use client";
import { useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabaseClient";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

export default function NewsletterPage() {
  const [posts, setPosts] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]); // State for archived journals
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // 1. Fetch saved journals from Supabase
  const fetchDrafts = useCallback(async () => {
    const { data, error } = await supabase
      .from("newsletter")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSavedDrafts(data);
    else console.error("Error fetching drafts:", error);
  }, []);

  // 2. Fetch blogs from Sanity and journals from Supabase on load
  useEffect(() => {
    async function fetchData() {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc) [0...10] {
          title,
          excerpt,
          "slug": slug.current,
          mainImage { asset->{url} }
        }`;
        const data = await client.fetch(query);
        setPosts(data);
        await fetchDrafts();
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchDrafts]);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    
    const journalIntro = `Dear Partners and Clients,

At Shama Landscape Architects, we believe every space tells a story of ecological harmony. We recently explored "${post.title}" on our journal, and I wanted to share these insights with you.

${post.excerpt}

Discover the full design narrative here: https://shama.co.ke/blog/${post.slug}

Warmly,
The Shama Team`;

    setContent(journalIntro);
  };

  const handleSave = async () => {
    if (!title || !content) return setMessage("Title and content are required");

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      setMessage("Authentication failed. Please log in again.");
      return;
    }

    const { error } = await supabase.from("newsletter").insert([
      {
        title,
        content,
        status: "draft",
        author_id: user.id,
        metadata: { 
          source: "sanity_blog", 
          style: "journal",
          image_url: selectedPost?.mainImage?.asset?.url,
          slug: selectedPost?.slug 
        } 
      },
    ]);

    if (error) {
      setMessage(`Database Error: ${error.message}`);
    } else {
      setMessage("Journal entry saved to newsletter queue!");
      setIsPreviewing(false);
      setTitle("");
      setContent("");
      setSelectedPost(null);
      await fetchDrafts(); // Refresh archive after saving
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-6xl min-h-screen p-8 mx-auto bg-stone-50">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Journal Curator</h1>
        <p className="mt-1 text-sm text-stone-600">Transform Shama blog insights into curated client newsletters.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side: Sanity Blog Selector */}
        <section className="p-6 bg-white border shadow-sm border-stone-200 rounded-2xl">
          <h2 className="mb-4 text-xs font-bold tracking-widest uppercase text-emerald-700">Recent Shama Blogs</h2>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-stone-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="pr-2 space-y-4 overflow-y-auto max-h-150 custom-scrollbar">
              {posts.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => handleSelectPost(post)}
                  className={`w-full flex text-left gap-4 p-3 rounded-xl transition-all border ${
                    selectedPost?.slug === post.slug 
                    ? "border-emerald-600 bg-emerald-50 shadow-sm" 
                    : "border-transparent hover:bg-stone-50"
                  }`}
                >
                  <div className="relative w-20 h-20 overflow-hidden border rounded-lg shrink-0 bg-stone-100 border-stone-200">
                    {post.mainImage && (
                      <Image src={post.mainImage.asset.url} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-stone-900 line-clamp-1">{post.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-stone-500 line-clamp-2">{post.excerpt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Right Side: Newsletter Composer */}
        <section className="p-8 bg-white border-t-4 shadow-xl border-emerald-800 rounded-2xl">
          <h2 className="mb-6 font-serif text-xl italic text-stone-800">Compose Journal Entry</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Subject Line</label>
              <input
                placeholder="e.g., Designing for Ecological Harmony"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 mt-1 transition-all border rounded-lg outline-none bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Journal Content</label>
              <textarea
                placeholder="Start your design narrative..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 mt-1 font-serif text-lg leading-relaxed transition-all border rounded-lg outline-none resize-none h-80 bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setIsPreviewing(true)}
              disabled={!title || !content}
              className="w-full py-4 font-bold text-white transition-all rounded-lg shadow-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview Journal Entry
            </button>
            {message && (
              <p className={`p-3 text-center rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800 animate-pulse'}`}>
                {message}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* --- JOURNAL ARCHIVE SECTION --- */}
      <section className="pt-12 pb-20 mt-16 border-t border-stone-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Journal Archive</h2>
            <p className="text-sm text-stone-500">Review previously saved drafts and narratives.</p>
          </div>
          <button onClick={fetchDrafts} className="text-xs font-bold tracking-widest uppercase transition-colors text-emerald-700 hover:text-emerald-900">
            Refresh Archive
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedDrafts.length === 0 ? (
            <p className="py-20 italic text-center border-2 border-dashed col-span-full text-stone-400 border-stone-200 rounded-3xl">
              No journals saved in the archive yet.
            </p>
          ) : (
            savedDrafts.map((draft) => (
              <div key={draft.id} className="p-6 transition-all bg-white border border-stone-100 rounded-2xl hover:shadow-lg group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-stone-100 text-stone-600">
                    {draft.status}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-stone-900 line-clamp-1">{draft.title}</h3>
                <p className="mb-6 text-xs leading-relaxed text-stone-500 line-clamp-3">
                  {draft.content}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-stone-50">
                  <button 
                    onClick={() => {
                      setTitle(draft.title);
                      setContent(draft.content);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Edit & Re-use
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- PREVIEW MODAL --- */}
      {isPreviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-stone-100">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-800">Shama Journal Preview</span>
              <button onClick={() => setIsPreviewing(false)} className="p-2 transition-colors text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <div className="p-10 grow">
              {selectedPost?.mainImage && (
                <div className="relative w-full mb-8 overflow-hidden shadow-md aspect-21/9 rounded-2xl">
                   <Image src={selectedPost.mainImage.asset.url} alt="Banner" fill className="object-cover" unoptimized />
                </div>
              )}
              <h2 className="mb-6 font-serif text-4xl font-bold leading-tight text-stone-900">{title}</h2>
              <div className="prose prose-stone max-w-none">
                <p className="pl-6 font-serif text-lg italic leading-relaxed whitespace-pre-wrap border-l-4 text-stone-700 border-emerald-100">
                  {content}
                </p>
              </div>
            </div>
            <div className="sticky bottom-0 flex gap-4 p-6 border-t bg-stone-50 border-stone-100">
              <button onClick={handleSave} className="flex-1 py-4 font-bold text-white transition-all shadow-md bg-emerald-800 rounded-xl hover:bg-emerald-900">
                Confirm & Save Draft
              </button>
              <button onClick={() => setIsPreviewing(false)} className="flex-1 py-4 font-bold transition-colors bg-white border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-100">
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}