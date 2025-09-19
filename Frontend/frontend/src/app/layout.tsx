'use client';

import './globals.css';


import React, { ReactNode } from 'react';


type Props = { children: ReactNode };


export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
