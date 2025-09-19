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
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Categories for Navigation ID: {navId}</h1>
      <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
  {categories.map(cat => (
    <li key={cat.id} className="bg-white border rounded-xl shadow-sm p-4 transition hover:shadow-lg hover:border-indigo-200">
      <Link href={`/category/${cat.id}`} className="block text-lg font-semibold text-blue-600 hover:underline">
        {cat.name}
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
}
