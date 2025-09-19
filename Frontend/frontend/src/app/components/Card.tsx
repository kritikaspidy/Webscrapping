import Link from "next/link";

type CardProps = { 
  title: string; 
  href: string; 
  imageSrc: string; 
  price: string; 
  className?: string; 
};

export default function Card({ title, href, imageSrc, price, className }: CardProps) {
  return (
    <div className={`product-card bg-white rounded-lg shadow-md border flex flex-col p-4 w-70 h-90 ${className}`}>
      <img
        src={imageSrc}
        alt={title}
        className="product-image h-32 w-full object-contain mb-3 rounded"
      />
      <h3 className="text-base text-gray-900 font-semibold mb-1 truncate" title={title}>
        {title.length > 25 ? title.slice(0, 23) + "…" : title}
      </h3>
      <div className="price text-green-700 text-sm font-medium mb-2">{price}</div>
      <div className="mt-auto w-full">
        <Link href={href} aria-label={`View details for ${title}`}>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow transition
            hover:bg-blue-700 focus:bg-blue-800 focus:outline-none border border-blue-800">
            Details
          </button>
        </Link>
      </div>
    </div>
  );
}
