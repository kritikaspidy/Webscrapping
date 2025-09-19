'use client';
import React, { useState, useEffect } from 'react';

type NavigationItem = {
  id: number;
  title: string;
};

type Category = {
  id: number;
  name: string;
};

type Props = {
  onSelectHeading: (heading: string | null) => void;
  onSelectCategory: (category: string | null) => void;
  selectedHeading: string | null;
  selectedCategory: string | null;
};

export default function Navigation({
  onSelectHeading,
  onSelectCategory,
  selectedHeading,
  selectedCategory,
}: Props) {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/navigation')
      .then((res) => res.json())
      .then(setNavItems)
      .catch(console.error);
  }, []);

  // Fetch categories when a heading is expanded
  useEffect(() => {
    if (expandedId !== null) {
      setLoadingCategories(true);
      fetch(`http://localhost:3000/category/navigation/${expandedId}`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          setLoadingCategories(false);
        })
        .catch(() => {
          setCategories([]);
          setLoadingCategories(false);
        });
    } else {
      setCategories([]);
    }
  }, [expandedId]);

  return (
    <nav>
      <h2 className="font-bold text-xl mb-4">Browse by Heading</h2>
      <ul>
        {navItems.map((heading) => (
          <li key={heading.id} className="mb-2">
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${
                selectedHeading === heading.title
                  ? 'bg-blue-100 font-bold'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                onSelectHeading(heading.title);
                setExpandedId(expandedId === heading.id ? null : heading.id);
                onSelectCategory(null);
              }}
            >
              {heading.title}
              <span className="float-right">{expandedId === heading.id ? '▲' : '▼'}</span>
            </button>
            {expandedId === heading.id && (
              <div className="ml-4 mt-2">
                {loadingCategories ? (
                  <div className="text-sm text-gray-500">Loading categories...</div>
                ) : categories.length > 0 ? (
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          className={`w-full text-left px-2 py-1 rounded ${
                            selectedCategory === cat.name
                              ? 'bg-blue-200 font-semibold'
                              : 'hover:bg-gray-200'
                          }`}
                          onClick={() => onSelectCategory(cat.name)}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-gray-400">No categories found</div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <button
        className="text-blue-700 underline mt-2"
        onClick={() => {
          onSelectHeading(null);
          onSelectCategory(null);
          setExpandedId(null);
        }}
      >
        View All Products
      </button>
    </nav>
  );
}