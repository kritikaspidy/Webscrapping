'use client';

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ProductList from './category/[categoryId]/page';

export default function LandingPage() {
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div >
      <header >
        <h1 >Book Explorer</h1>
      </header>

      <div >
        {/* Sidebar */}
        <aside >
          <Navigation
            onSelectHeading={(heading) => {
              setSelectedHeading(heading);
              setSelectedCategory(null);
            }}
            onSelectCategory={(category) => setSelectedCategory(category)}
          />
        </aside>
        {/* Main content */}
        <main >
          <ProductList
            selectedHeading={selectedHeading}
            selectedCategory={selectedCategory}
          />
        </main>
      </div>
    </div>
  );
}
