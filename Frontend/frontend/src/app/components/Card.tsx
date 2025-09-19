'use client';
import Link from 'next/link';

type CardProps = {
  title: string;
  href: string;
  imageSrc: string;
  price: string;
  className?: string;
};

export default function Card({ title, href, imageSrc, price, className = '' }: CardProps) {
  return (
    <Link href={href} aria-label={title} className={`block bg-white rounded-xl shadow-md hover:shadow-lg hover:border-blue-400 border p-4 transition ${className}`}>
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover rounded mb-4" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="text-blue-600 font-semibold text-xl">{price}</div>
    </Link>
  );
}