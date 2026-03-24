import { writeClient } from '@/sanity/lib/client'

export async function POST(request) {
  try {
    const body = await request.json()
    const { user, source, behavior, intent, createdAt } = body

    // Create lead - USE WRITE CLIENT
    await writeClient.create({
      _type: 'lead',
      user,
      source,
      behavior,
      intent,
      createdAt: createdAt || new Date().toISOString(),
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error creating lead:', error)
    // Don't fail the request - this is background tracking
    return Response.json({ success: false, error: error.message })
  }
}