export function getSessionId() {
  if (typeof window === 'undefined') return null
  
  let sessionId = localStorage.getItem('shama_session_id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('shama_session_id', sessionId)
  }
  return sessionId
}