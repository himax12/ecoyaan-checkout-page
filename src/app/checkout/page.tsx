'use client';

import { AddressForm } from '@/components/AddressForm';
import { PriceSummary } from '@/components/PriceSummary';

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <AddressForm />
        </div>

        <div className="w-full lg:w-96">
          <PriceSummary onProceed={() => {}} ctaText="Complete Form to Proceed" />
        </div>
      </div>
    </div>
  );
}
