import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">About Us</h1>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to the Book Store, your number one source for all things books. We&apos;re dedicated to giving you the very best of literature, with a focus on dependability, customer service, and uniqueness.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Founded in 2024, the Book Store has come a long way from its beginnings. When we first started out, our passion for books drove us to build a platform that could offer a vast collection of titles to readers everywhere. We now serve customers all over the world and are thrilled to be a part of the eco-friendly wing of the book industry.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don&apos;t hesitate to contact us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
