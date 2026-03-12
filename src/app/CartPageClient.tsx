'use client';

import { CartItem } from '@/components/CartItem';
import { PriceSummary } from '@/components/PriceSummary';
import { useCheckout } from '@/context/CheckoutContext';
import { useRouter } from 'next/navigation';

export default function CartPageClient() {
  const { cartItems } = useCheckout();
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col gap-4">

          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-96">
          <PriceSummary 
            onProceed={() => router.push('/checkout')} 
            ctaText="Proceed to Checkout" 
          />
        </div>
      </div>
    </div>
  );
}
