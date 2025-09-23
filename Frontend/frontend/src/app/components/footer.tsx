import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <p className="text-gray-400">Email: support@bookstore.com</p>
          <p className="text-gray-400">Phone: +91-123-456-7890</p>
          <p className="text-gray-400">Address: 123 Book Lane, Reading City, 12345</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-green-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-green-400 transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-green-400 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Book Store. All rights reserved.
      </div>
    </footer>
  );
}