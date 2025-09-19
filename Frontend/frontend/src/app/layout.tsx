import Navigation from './components/Navigation';


import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body >
        

        {/* Main Content */}
        <main >
          {children}
        </main>

        {/* Footer */}
        <footer >
          &copy; 2025 Product Explorer | Powered by World of Books
        </footer>
      </body>
    </html>
  );
}
