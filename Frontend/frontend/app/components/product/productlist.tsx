'use client';

import React, { useState } from 'react';
import Card from './Card';
import ErrorMessage from '../ErrorMessage';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from './Pagination';
import Loader from '../Loader';
import { useSearchParams } from 'next/navigation';

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
  searchQuery: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
};

export default function ProductList({ selectedHeading, selectedCategory, searchQuery }: ProductListProps) {
  const [page, setPage] = useState(1);
  const limit = 20; // items per page
  // const searchParams = useSearchParams();
  // const searchQuery = searchParams.get('searchQuery') || '';


  const fetchProducts = async (): Promise<ProductsResponse> => {
    let apiUrl = `http://localhost:3000/products?page=${page}&limit=${limit}`;
    const params: string[] = [];

    if (selectedHeading) params.push(`heading=${encodeURIComponent(selectedHeading)}`);
    if (selectedCategory) params.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (searchQuery) params.push(`searchQuery=${encodeURIComponent(searchQuery)}`);
    
    if (params.length > 0) apiUrl += '&' + params.join('&');

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data;
  };

  const { data, isLoading, error } = useQuery<ProductsResponse, Error>({
    queryKey: ['products', selectedHeading, selectedCategory, searchQuery, page],
    queryFn: fetchProducts,
    placeholderData: keepPreviousData,
  });

  const products = data?.products || [];
  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  if (isLoading) {
    return (
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col min-h-[300px] rounded shadow">
            <Loader />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage message={error.message} />;

  if (!products.length)
    return <p className="text-gray-500">No products found.</p>;

  return (
    <>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {products.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            title={product.title}
            imageSrc={product.imageUrl}
            price={product.price}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}
