export function calculateLeadScore(timeOnPage, scrollDepth) {
  if (scrollDepth > 75 && timeOnPage > 180) return 'high'
  if (scrollDepth > 50 && timeOnPage > 60) return 'medium'
  return 'low'
}

export function sendLeadData(data) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/leads', JSON.stringify(data))
  }
}