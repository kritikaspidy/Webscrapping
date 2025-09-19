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
    <Link
  href={href}
  
  aria-label={title}
>
  <img src={imageSrc} alt={title} />
  <h3 >{title}</h3>
  <div >{price}</div>
</Link>

  );
}
