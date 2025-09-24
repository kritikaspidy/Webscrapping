'use client';

import { Product } from '@/types/product';
import Image from 'next/image';

type Props = { product: Product };

export default function ProductDetails({ product }: Props) {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-64 h-64 object-contain mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-2">Author: {product.author}</p>
      <p className="text-green-700 font-semibold mb-2">{product.price}</p>
      {product.category && (
        <p className="text-sm text-gray-500">Category: {product.category.name}</p>
      )}
    </div>
  );
}
