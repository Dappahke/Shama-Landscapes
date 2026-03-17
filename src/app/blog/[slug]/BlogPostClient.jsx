'use client';

import { useState, useEffect } from 'react';

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

const HeartIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform) => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 [writing-mode:vertical-lr] mb-2 hidden lg:block">
        Share
      </span>
      
      <button
        onClick={() => handleShare('twitter')}
        className="p-3 rounded-full bg-white shadow-md border border-stone-100 text-stone-400 hover:text-[#3596D5] hover:border-[#3596D5]/20 transition-all"
        aria-label="Share on Twitter"
      >
        <TwitterIcon className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => handleShare('linkedin')}
        className="p-3 rounded-full bg-white shadow-md border border-stone-100 text-stone-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/20 transition-all"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => handleShare('copy')}
        className="p-3 rounded-full bg-white shadow-md border border-stone-100 text-stone-400 hover:text-[#BD7563] hover:border-[#BD7563]/20 transition-all"
        aria-label={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? <CheckIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}

export function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setLiked(likedPosts.includes(postId));
    setCount(Math.floor(Math.random() * 50) + 10);
  }, [postId]);

  const handleLike = () => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    
    if (liked) {
      setCount(c => c - 1);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts.filter(id => id !== postId)));
    } else {
      setCount(c => c + 1);
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
    }
    setLiked(!liked);
  };

  return (
    <button
      onClick={handleLike}
      className={`group flex items-center gap-3 transition-all ${liked ? 'text-[#BD7563]' : 'text-stone-400 hover:text-[#BD7563]'}`}
    >
      <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
        liked 
          ? 'border-[#BD7563] bg-[#F5EBE8]' 
          : 'border-stone-200 group-hover:border-[#BD7563] group-hover:bg-[#F5EBE8]'
      }`}>
        <HeartIcon className="w-5 h-5" filled={liked} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-black tracking-widest uppercase">
          {liked ? 'Appreciated' : 'Appreciate'}
        </span>
        <span className="text-[10px] text-stone-400">{count} appreciations</span>
      </div>
    </button>
  );
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-[#BD7563] to-[#3596D5] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="p-6 border bg-stone-50 rounded-2xl border-stone-100">
      <h4 className="mb-2 font-serif font-bold text-stone-900">Stay Updated</h4>
      <p className="mb-4 text-sm text-stone-600">Get the latest stories delivered to your inbox.</p>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#3596D5]"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-[#3596D5] text-white text-sm font-semibold rounded-lg hover:bg-[#2d7ab8] transition-colors"
        >
          {status === 'success' ? 'Joined!' : 'Join'}
        </button>
      </form>
    </div>
  );
}