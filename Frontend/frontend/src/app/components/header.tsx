'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-green-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo + Site Name */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/logo.png" // replace with your logo path
            alt="Site Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold">My Book Store</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
