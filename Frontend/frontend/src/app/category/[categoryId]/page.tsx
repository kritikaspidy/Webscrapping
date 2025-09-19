'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/app/components/Card'; // update path if needed
import Loader from '@/app/components/Loader';
import ErrorMessage from '@/app/components/ErrorMessage';

export type Product = {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
  description?: string;
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
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [selectedHeading, selectedCategory]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (products.length === 0) return <div className="p-6 text-gray-500">No products found.</div>;

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
      {products.map(product => (
        <Card
          key={product.id}
          title={product.title}
          href={product.productUrl || "#"}
          imageSrc={product.imageUrl}
          price={product.price}
        />
      ))}
    </div>
  );
}