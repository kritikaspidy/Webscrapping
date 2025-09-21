'use client';

import './globals.css';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
