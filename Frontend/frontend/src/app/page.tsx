'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';
import ProductList from '@/app/components/product/productlist';
import Footer from '@/app/components/footer';

export default function LandingPage() {
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage
  useEffect(() => {
    const heading = localStorage.getItem('selectedHeading');
    const category = localStorage.getItem('selectedCategory');
    if (heading) setSelectedHeading(heading);
    if (category) setSelectedCategory(category);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (selectedHeading) localStorage.setItem('selectedHeading', selectedHeading);
    else localStorage.removeItem('selectedHeading');
  }, [selectedHeading]);

  useEffect(() => {
    if (selectedCategory) localStorage.setItem('selectedCategory', selectedCategory);
    else localStorage.removeItem('selectedCategory');
  }, [selectedCategory]);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    selectedHeading && { label: selectedHeading, href: '#' },
    selectedCategory && { label: selectedCategory, href: '#' },
  ].filter(Boolean) as { label: string; href: string }[];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedHeading(null);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        onSelectHeading={setSelectedHeading}
        onSelectCategory={setSelectedCategory}
        onSearch={handleSearch}
        selectedHeading={selectedHeading}
        selectedCategory={selectedCategory}
      />
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden bg-gray-50">
        <section className="flex-1 p-4 md:p-6 overflow-x-hidden bg-gray-50">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-600">
            {breadcrumbs.map((b, i) => (
              <span key={i}>
                {b.label === 'Home' ? (
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedHeading(null);
                      setSelectedCategory(null);
                      localStorage.removeItem('selectedHeading');
                      localStorage.removeItem('selectedCategory');
                    }}
                    className="hover:underline"
                  >
                    {b.label}
                  </a>
                ) : (
                  <a href={b.href} className="hover:underline">
                    {b.label}
                  </a>
                )}
                {i < breadcrumbs.length - 1 && ' / '}
              </span>
            ))}
          </nav>
          {/* Product Grid */}
          <ProductList selectedHeading={selectedHeading} selectedCategory={selectedCategory} searchQuery={searchQuery} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
