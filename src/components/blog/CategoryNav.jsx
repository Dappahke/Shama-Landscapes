'use client'

export default function CategoryNav({ categories, activeCategory, onSelect }) {
  return (
    <nav className="category-nav">
      <button
        className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.slug.current}
          className={`category-btn ${activeCategory === category.slug.current ? 'active' : ''}`}
          onClick={() => onSelect(category.slug.current)}
        >
          {category.title}
        </button>
      ))}
    </nav>
  )
}