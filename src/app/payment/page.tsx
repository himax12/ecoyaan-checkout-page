'use client';

import { OrderReview } from '@/components/OrderReview';
import { StickyFooter } from '@/components/StickyFooter';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useState } from 'react';

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, shipping_fee, discount_applied, addresses, selectedAddressId } = useCheckout();
  const { initiatePayment } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingAddress = addresses.find(a => a.id === selectedAddressId);
  const subtotal = cartItems.reduce((acc, i) => acc + i.product_price * i.quantity, 0);
  const isCartEmpty = cartItems.length === 0;
  const grandTotal = subtotal + (isCartEmpty ? 0 : shipping_fee) - discount_applied;

  const handlePayment = async () => {
    setIsProcessing(true);
    await initiatePayment({
      amount: grandTotal,
      prefill: {
        name: shippingAddress?.fullName,
        email: shippingAddress?.email,
        contact: shippingAddress?.phoneNumber,
      },
      onSuccess: () => {
        setIsProcessing(false);
        router.push('/success');
      },
      onFailure: (error) => {
        alert(error);
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen pb-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment & Confirmation</h1>
        <p className="text-sm text-gray-500 mt-1">Review your order and confirm payment.</p>
      </div>
      <OrderReview />
      
      <StickyFooter 
        onBack={() => router.push('/checkout')}
        onNext={handlePayment}
        nextLabel={isProcessing ? 'Processing Payment...' : 'Pay Securely'}
        nextDisabled={!shippingAddress || isProcessing || isCartEmpty}
        price={grandTotal}
      />
    </div>
  );
}
