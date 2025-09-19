'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/app/components/Card';
import Loader from '@/app/components/Loader';
import ErrorMessage from '@/app/components/ErrorMessage';

export type Product = {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  price: string;
  heading: string;
  category: string;
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
    if (!selectedHeading) {
      setProducts([]);
      return;
    }

    setLoading(true);
    let url = `http://localhost:3000/products?heading=${encodeURIComponent(selectedHeading)}`;
    if (selectedCategory) {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }

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

 

  return (
    <div>
      {products.map(product => (
        <Card
          key={product.id}
          title={product.title}
          href="#"
          imageSrc={product.imageUrl}
          
          price={product.price}
        />
      ))}
    </div>
  );
}
