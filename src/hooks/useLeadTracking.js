'use client'

import { useState, useEffect, useRef } from 'react'
import { calculateLeadScore, sendLeadData } from '@/lib/blog/lead-tracking'

export function useLeadTracking(post) {
  const [scrollDepth, setScrollDepth] = useState(0)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [leadScore, setLeadScore] = useState('low')
  const startTime = useRef(Date.now())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      setScrollDepth(prev => Math.max(scrollPercent, prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000)
      setTimeOnPage(seconds)
      setLeadScore(calculateLeadScore(seconds, scrollDepth))
    }, 1000)
    return () => clearInterval(interval)
  }, [scrollDepth])

  useEffect(() => {
    const handleBeforeUnload = () => {
      const data = {
        user: { name: '', email: '' },
        source: {
          type: 'blog',
          postTitle: post.title,
          postSlug: post.slug.current,
          category: post.categories?.[0]?.title || '',
        },
        behavior: { timeOnPage, scrollDepth, clickedCTA: false },
        intent: leadScore,
        createdAt: new Date().toISOString(),
      }
      sendLeadData(data)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      handleBeforeUnload()
    }
  }, [post, timeOnPage, scrollDepth, leadScore])

  return { scrollDepth, timeOnPage, leadScore }
}