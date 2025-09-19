'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ProductDetail = {
  id: number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
  // Add other fields as needed
};

async function fetchFromBackend(endpoint: string) {
  const res = await fetch(`http://localhost:3000${endpoint}`);
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchFromBackend(`/product/${productId}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.title} className="w-full max-w-md mb-6 rounded" />
      )}
      <p className="mb-4">{product.description}</p>
      <p className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</p>
      {product.productUrl && (
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Product on Original Site
        </a>
      )}
    </div>
  );
}
