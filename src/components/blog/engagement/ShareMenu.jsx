'use client'

import { useState } from 'react'

export default function ShareMenu({ url, title }) {
  const [isOpen, setIsOpen] = useState(false)

  function shareOn(platform) {
    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(title)
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    
    setIsOpen(false)
  }

  return (
    <div className="share-wrapper">
      <button 
        className="engagement-btn share-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>Share</span>
      </button>
      
      {isOpen && (
        <div className="share-menu">
          <button onClick={() => shareOn('twitter')}>Twitter</button>
          <button onClick={() => shareOn('facebook')}>Facebook</button>
          <button onClick={() => shareOn('linkedin')}>LinkedIn</button>
          <button onClick={() => shareOn('whatsapp')}>WhatsApp</button>
          <button onClick={() => shareOn('email')}>Email</button>
          <button onClick={() => shareOn('copy')}>Copy Link</button>
        </div>
      )}
    </div>
  )
}