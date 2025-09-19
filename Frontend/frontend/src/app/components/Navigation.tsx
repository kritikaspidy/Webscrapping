'use client';

import React, { useState, useEffect } from 'react';

export type NavigationItem = {
  id: number;
  title: string;
  categories: string[];
};

type NavigationProps = {
  onSelectHeading: (heading: string) => void;
  onSelectCategory: (category: string | null) => void;
};

export default function Navigation({ onSelectHeading, onSelectCategory }: NavigationProps) {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/navigation')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch navigation');
        return res.json();
      })
      .then((data: NavigationItem[]) => setNavItems(data))
      .catch(console.error);
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectHeading = (title: string, id: number) => {
    setActiveHeading(title);
    setActiveCategory(null);
    onSelectHeading(title);
    onSelectCategory(null);
    // Optionally collapse other expanded, keep current expanded too
    setExpanded(prev => ({ ...prev, [id]: true }));
  };

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    onSelectCategory(cat);
  };

  return (
    <aside >
      <h2 >Browse Categories</h2>
      {navItems.length === 0 && <p >Loading...</p>}
      {navItems.map(({ id, title, categories }) => (
        <div key={id} >
          <button
            onClick={() => selectHeading(title, id)}
             >
            {title}
          </button>
          {expanded[id] && categories?.length > 0 && (
            <ul >
              {categories.map(cat => (
                <li
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}
