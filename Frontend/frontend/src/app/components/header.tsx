'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type NavigationItem = { id: number; title: string };
type Category = { id: number; name: string };

type HeaderProps = {
  onSelectHeading: (heading: string | null) => void;
  onSelectCategory: (category: string | null) => void;
  onSearch: (query: string) => void;
  selectedHeading: string | null;
  selectedCategory: string | null;
};

export default function Header({
  onSelectHeading,
  onSelectCategory,
  onSearch,
  selectedHeading,
  selectedCategory,
}: HeaderProps) {
  const router = useRouter();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<number, Category[]>>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch headings
  useEffect(() => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then(setNavItems)
      .catch(console.error);
  }, []);

  // Fetch categories on hover
  useEffect(() => {
    if (hoveredId !== null && !categoriesMap[hoveredId]) {
      fetch(`/api/category/navigation/${hoveredId}`)
        .then((res) => res.json())
        .then((cats: Category[]) => {
          setCategoriesMap((prev) => ({ ...prev, [hoveredId]: cats }));
        })
        .catch(() => {
          setCategoriesMap((prev) => ({ ...prev, [hoveredId]: [] }));
        });
    }
  }, [hoveredId, categoriesMap]);

  const handleHeadingClick = (title: string) => {
    onSelectHeading(title);
    onSelectCategory(null);
    router.push('/');
  };

  const handleCategoryClick = (headingTitle: string, categoryName: string) => {
    onSelectHeading(headingTitle);
    onSelectCategory(categoryName);
    router.push('/');
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
    router.push(`/?searchQuery=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white text-gray-800 shadow">
      {/* Top section: Ad Banner */}
      <div className="bg-green-700 text-white text-center py-2 text-sm font-semibold">
        Where stories find their readers.
      </div>

      {/* Middle section: Logo, Search, and User Links */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-green-600" onClick={() => {
          onSelectHeading(null);
          onSelectCategory(null);
          onSearch('');
        }}>
          📚 Book Store
        </Link>
        
        {/* Search bar */}
        <div className="flex flex-1 mx-8">
            <input
                type="text"
                placeholder="Search by title, author, or ISBN"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearchClick();
                    }
                    
                }}
                className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
                onClick={handleSearchClick}
                className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
            >
                Search
            </button>
        </div>

        <nav className="flex space-x-4">
          <Link href="/about" className="hover:text-green-600 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-green-600 transition">
            Contact
          </Link>
        </nav>
      </div>

      {/* Bottom section: Headings with Dropdowns */}
      <div className="bg-green-600 text-white px-6 py-2 flex justify-center">
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative group"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => handleHeadingClick(item.title)}
                className={`px-2 py-1 rounded transition-colors duration-200 ${
                  selectedHeading === item.title ? 'bg-green-800' : 'hover:bg-green-700'
                }`}
              >
                {item.title}
              </button>

              {/* Dropdown with categories */}
              {hoveredId === item.id && (
                <div className="absolute top-full left-0 mt-2 
             bg-white text-gray-800 rounded-lg shadow-lg z-50 p-4 
             w-max max-w-screen-lg" >
                  {categoriesMap[item.id]?.length ? (
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                      {categoriesMap[item.id].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(item.title, cat.name)}
                          className={`block w-full text-left px-2 py-1 rounded transition-colors duration-200 hover:bg-gray-100 ${
                            selectedCategory === cat.name ? 'font-semibold text-green-700' : ''
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">No categories</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}