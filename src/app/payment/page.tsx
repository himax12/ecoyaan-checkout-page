'use client';

import { OrderReview } from '@/components/OrderReview';

export default function PaymentPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment & Confirmation</h1>
        <p className="text-sm text-gray-500 mt-1">Review your order and confirm payment.</p>
      </div>
      <OrderReview />
    </div>
  );
}
