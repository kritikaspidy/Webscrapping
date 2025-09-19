'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/app/components/Navigation';
import Card from '@/app/components/Card';
import Loader from '@/app/components/Loader';
import ErrorMessage from '@/app/components/ErrorMessage';

export type Product = {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
  productUrl?: string;
};

export default function LandingPage() {
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  return (
    <main className="flex min-h-screen">
      <div className="w-64 bg-green-200 p-4 flex-shrink-0 rounded-lg shadow-md">
        
        <Navigation
          onSelectHeading={setSelectedHeading}
          onSelectCategory={setSelectedCategory}
          selectedHeading={selectedHeading}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Content */}
      <section className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">All products</h1>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <div className="flex flex-wrap gap-4">
            {products.map(product => (
              <Card
                key={product.id}
                title={product.title}
                href={product.productUrl || '#'}
                imageSrc={product.imageUrl}
                price={product.price}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
