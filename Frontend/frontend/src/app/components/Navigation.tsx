'use client';

import React, { useState, useEffect } from 'react';

type NavigationItem = { id: number; title: string };
type Category = { id: number; name: string };

type Props = {
  onSelectHeading: (heading: string | null) => void;
  onSelectCategory: (category: string | null) => void;
  selectedHeading: string | null;
  selectedCategory: string | null;
  className?: string;
};

export default function Navigation({
  onSelectHeading,
  onSelectCategory,
  selectedHeading,
  selectedCategory,
  className = '',
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
    <aside >
      <nav aria-label="sidebar">
        <h2 className="font-semibold text-lg mb-4">Books</h2>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onSelectHeading(item.title);
                  setExpandedId(expandedId === item.id ? null : item.id);
                  onSelectCategory(null);
                }}
                className={`block w-full text-left px-3 py-2 rounded transition
                 
                  ${selectedHeading === item.title ? "bg-white-50 font-bold" : "text-gray-800"}`}
                aria-expanded={expandedId === item.id}
                aria-controls={`category-list-${item.id}`}
              >
                {item.title}
              </button>
              {expandedId === item.id && (
                <ul
                  className="ml-4 mt-2 space-y-1"
                  id={`category-list-${item.id}`}
                  role="region"
                  aria-live="polite"
                >
                  {loadingCategories ? (
                    <li>Loading categories...</li>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() => onSelectCategory(cat.name)}
                          className={`block px-2 py-1 rounded hover:bg-blue-50 focus:bg-blue-100
                            focus:outline-none ${selectedCategory === cat.name ? "font-bold" : ""}`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No categories found</li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
