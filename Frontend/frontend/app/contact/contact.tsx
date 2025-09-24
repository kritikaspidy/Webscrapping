import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Contact Us</h1>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We&aps;d love to hear from you! Whether you have a question about our products, need assistance, or just want to share your love for books, feel free to reach out.
            </p>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Email</h2>
                <a href="mailto:support@bookstore.com" className="text-lg text-blue-600 hover:underline">support@bookstore.com</a>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Phone</h2>
                <p className="text-lg text-gray-700">+91-123-456-7890</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Address</h2>
                <p className="text-lg text-gray-700">123 Book Lane, Reading City, 12345</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
