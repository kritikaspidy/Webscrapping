// Card.tsx
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
    <Link href={`/products/${id}`} className={`product-card block ${className}`}>
      <div className="rounded-lg shadow hover:shadow-md transition p-4 bg-white">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-48 object-contain mb-2"
        />
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-green-700">{price}</p>
      </div>
    </Link>
  );
}
