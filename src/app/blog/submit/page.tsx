import { client } from '@/sanity/lib/client'
import { categoriesQuery } from '@/sanity/lib/queries'
import SubmitForm from '@/components/blog/SubmitForm'

export const metadata = {
  title: 'Submit Your Story | Shama Landscape Architects',
  description: 'Share your landscape journey with us. Submit your garden project, design questions, or collaboration ideas.',
}

export default async function SubmitPage() {
  const categories = await client.fetch(categoriesQuery)

  return (
    <div className="submit-page">
      <header className="submit-header">
        <h1>Rooted by Shama</h1>
        <p>Share your landscape journey with our community</p>
      </header>
      
      <SubmitForm categories={categories} />
    </div>
  )
}