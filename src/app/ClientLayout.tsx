import React from 'react';
import { CheckoutContextType } from '@/types';
import { CheckoutProvider } from '@/context/CheckoutContext';

export default function ClientLayout({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: CheckoutContextType;
}) {
  return (
    <CheckoutProvider initialData={initialData}>
      {children}
    </CheckoutProvider>
  );
}
