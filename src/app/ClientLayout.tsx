'use client';

import React from 'react';
import { CheckoutContextType } from '@/types';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { AuthProvider } from '@/context/AuthContext';

export default function ClientLayout({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: CheckoutContextType;
}) {
  return (
    <AuthProvider>
      <CheckoutProvider initialData={initialData}>
        {children}
      </CheckoutProvider>
    </AuthProvider>
  );
}
