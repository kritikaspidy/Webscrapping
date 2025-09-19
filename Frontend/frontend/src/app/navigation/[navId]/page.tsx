'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Example type for Category
type Category = {
  id: number;
  name: string;
};

// Remove this example array once fetching from backend works
// const categories = [
//   { id: 1, name: 'Category 1' },
//   { id: 2, name: 'Category 2' },
//   { id: 3, name: 'Category 3' },
// ];

// API fetch helper function
async function fetchFromBackend(endpoint: string) {
  const res = await fetch(`http://localhost:3000${endpoint}`);
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

export default function CategoriesPage() {
  const params = useParams();
  const navId = params.navId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchFromBackend(`/category/navigation/${navId}`)
      .then(setCategories)
      .catch((err) => {
        setError(err.message || 'Failed to load categories');
      })
      .finally(() => setLoading(false));
  }, [navId]);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <ul >
        {categories.map(cat => (
          <li key={cat.id} >
            <Link href={`/category/${cat.id}`} >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}
