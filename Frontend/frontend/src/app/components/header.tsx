'use client';

import React, { useEffect, useState } from 'react';

type NavigationItem = { id: number; title: string };
type Category = { id: number; name: string };

type HeaderProps = {
  onSelectHeading: (heading: string | null) => void;
  onSelectCategory: (category: string | null) => void;
  selectedHeading: string | null;
  selectedCategory: string | null;
};

export default function Header({
  onSelectHeading,
  onSelectCategory,
  selectedHeading,
  selectedCategory,
}: HeaderProps) {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<number, Category[]>>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Fetch headings
  useEffect(() => {
    fetch('http://localhost:3000/navigation')
      .then((res) => res.json())
      .then(setNavItems)
      .catch(console.error);
  }, []);

  // Fetch categories on hover
  useEffect(() => {
    if (hoveredId !== null && !categoriesMap[hoveredId]) {
      fetch(`http://localhost:3000/category/navigation/${hoveredId}`)
        .then((res) => res.json())
        .then((cats: Category[]) => {
          setCategoriesMap((prev) => ({ ...prev, [hoveredId]: cats }));
        })
        .catch(() => {
          setCategoriesMap((prev) => ({ ...prev, [hoveredId]: [] }));
        });
    }
  }, [hoveredId, categoriesMap]);

  return (
    <header className="bg-green-600 text-white px-6 py-4 flex items-center justify-between shadow">
      <h1 className="text-2xl font-bold">📚 Book Store</h1>

      {/* Headings */}
      <nav className="flex gap-6 relative">
        {navItems.map((item) => (
          <div
            key={item.id}
            className="relative group"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => {
                onSelectHeading(item.title);
                onSelectCategory(null);
              }}
              className={`px-2 py-1 rounded ${
                selectedHeading === item.title ? 'bg-green-800' : 'hover:bg-green-700'
              }`}
            >
              {item.title}
            </button>

            {/* Dropdown with categories */}
            {hoveredId === item.id && (
              <div className="absolute top-full left-0 mt-2 bg-white text-black rounded shadow-lg w-40 z-50">
                {categoriesMap[item.id]?.length ? (
                  categoriesMap[item.id].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectHeading(item.title);
                        onSelectCategory(cat.name);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedCategory === cat.name ? 'font-semibold text-green-700' : ''
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">No categories</p>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}
