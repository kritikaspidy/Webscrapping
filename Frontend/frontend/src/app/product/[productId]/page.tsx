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
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.title}/>
      )}
      <p>{product.description}</p>
      <p>${product.price.toFixed(2)}</p>
      {product.productUrl && (
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
         
        >
          View Product on Original Site
        </a>
      )}
    </div>
  );
}
