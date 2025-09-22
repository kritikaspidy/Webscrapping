'use client';

import Link from "next/link";

type CardProps = { 
  id: number;
  title: string; 
  imageSrc: string; 
  price: string; 
  className?: string; 
};

export default function Card({ id, title, imageSrc, price, className = "" }: CardProps) {
  return (
    <div className={`product-card ${className} flex flex-col min-h-[300px]`}>
  <img
    src={imageSrc}
    alt={title}
    className="product-image w-full max-w-full object-contain mb-3 rounded"
  />
  <h3 className="text-base text-gray-900 font-semibold mb-1 truncate min-h-[3rem]">{title}</h3>
  <div className="price text-green-700 text-sm font-medium mb-2">{price}</div>
  <div className="mt-auto w-full">
    <Link href={`/products/${id}`}>
      <button className="add-button w-full px-4 py-2 text-white shadow transition hover:bg-blue-700 focus:bg-blue-800 focus:outline-none border border-blue-800">
        Details
      </button>
    </Link>
  </div>
</div>

  );
}
