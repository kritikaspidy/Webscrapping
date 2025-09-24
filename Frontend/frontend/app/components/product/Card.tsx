// Card.tsx
'use client';

import Link from "next/link";
import Image from "next/image";

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
      <div className="rounded-lg shadow hover:shadow-md transition p-4 bg-white h-full flex flex-col">
        <img src={imageSrc} alt={title} width={300} height={192} className="w-full h-48 object-contain mb-2" />
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-green-700">{price}</p>
      </div>
    </Link>
  );
}
