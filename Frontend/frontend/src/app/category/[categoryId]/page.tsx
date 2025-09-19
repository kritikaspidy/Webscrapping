'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/app/components/Card'; // Adjust path if needed
import Loader from '@/app/components/Loader';
import ErrorMessage from '@/app/components/ErrorMessage';

export type Product = {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
  productUrl?: string;
};

type ProductListProps = {
  selectedHeading: string | null;
  selectedCategory: string | null;
};

export default function ProductList({ selectedHeading, selectedCategory }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = 'http://localhost:3000/products';
    const params: string[] = [];
    if (selectedHeading) params.push(`heading=${encodeURIComponent(selectedHeading)}`);
    if (selectedCategory) params.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (params.length > 0) url += '?' + params.join('&');

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [selectedHeading, selectedCategory]);

  if (loading) return <Loader />;

  if (error) return (
    <section aria-live="assertive" className="p-6">
      <ErrorMessage message={error} />
    </section>
  );

  if (products.length === 0) return (
    <section className="p-6 text-gray-500" role="region" aria-live="polite">
      No products found.
    </section>
  );

  return (
    
      <section>
        {products.map((product) => (
          <Card
            key={product.id}
            title={product.title}
            href={product.productUrl || '#'}
            imageSrc={product.imageUrl}
            price={product.price}
          />
        ))}
      </section>
   
  );
}
