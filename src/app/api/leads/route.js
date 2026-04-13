import { writeClient } from '@/sanity/lib/client';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      user = {},
      source = 'ai-agent',
      behavior = {},
      intent = {},
      createdAt,
    } = body;

    // Normalize data from AI agent
    const lead = {
      _type: 'lead',
      name: user.name || intent.name || 'Unknown',
      location: user.location || intent.location || '',
      project_type: user.project_type || intent.project_type || '',
      budget: user.budget || intent.budget || '',
      timeline: user.timeline || intent.timeline || '',
      phone: user.phone || intent.phone || '',
      source,
      behavior,
      intent,
      createdAt: createdAt || new Date().toISOString(),
    };

    await writeClient.create(lead);

    return Response.json({
      success: true,
      lead_id: lead._id,
    });
  } catch (error) {
    console.error('Error creating lead:', error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}