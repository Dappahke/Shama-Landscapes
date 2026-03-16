import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProjectPage({ params }) {
  const { id } = params;

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    notFound(); // Redirects to 404 if project doesn't exist
  }

  return (
    <main className="min-h-screen pt-24 bg-white">
      <div className="px-6 mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <p className="text-xl text-gray-600">{project.tagline}</p>
        
        {/* Render your gallery using project.image_gallery */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {project.image_gallery.map((img) => (
            <img key={img} src={img} className="rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}