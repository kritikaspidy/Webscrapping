'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ProductDetails from '@/app/components/product/productDetails';

export default function ProductDetailsPage() {
  const { productId } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () =>
      fetch(`http://localhost:3000/products/${productId}`).then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product.</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <main className="flex-grow p-6 bg-gray-50">
      <ProductDetails product={product} />
    </main>
  );
}
