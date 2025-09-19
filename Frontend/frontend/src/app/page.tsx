'use client';
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ProductList from './category/[categoryId]/page';

export default function LandingPage() {
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-6 text-3xl font-bold">
        Book Explorer
      </header>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r min-h-screen p-6">
          <Navigation
            onSelectHeading={heading => {
              setSelectedHeading(heading);
              setSelectedCategory(null);
            }}
            onSelectCategory={category => setSelectedCategory(category)}
            selectedHeading={selectedHeading}
            selectedCategory={selectedCategory}
          />
        </aside>
        {/* Main content */}
        <main className="flex-1 p-8">
          <ProductList
            selectedHeading={selectedHeading}
            selectedCategory={selectedCategory}
          />
        </main>
      </div>
      <footer className="bg-white text-gray-400 text-center py-4 border-t">
        &copy; 2025 Product Explorer | Powered by World of Books
      </footer>
    </div>
  );
}