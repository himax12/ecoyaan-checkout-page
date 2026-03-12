'use client';

import { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useRazorpay } from '@/hooks/useRazorpay';
import Image from 'next/image';

export function OrderReview() {
  const { cartItems, shippingAddress, shipping_fee, discount_applied } = useCheckout();
  const router = useRouter();
  const { initiatePayment } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, i) => acc + i.product_price * i.quantity, 0);
  const grandTotal = subtotal + shipping_fee - discount_applied;

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4 py-3">
              <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden bg-gray-50">
                <Image src={item.image} alt={item.product_name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{item.product_price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span className="text-[#10b981]">₹{grandTotal}</span>
        </div>
      </div>

      {shippingAddress && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery to</h2>
          <p className="text-gray-800 font-medium">{shippingAddress.fullName}</p>
          <p className="text-gray-600 text-sm">{shippingAddress.email} · {shippingAddress.phoneNumber}</p>
          <p className="text-gray-600 text-sm mt-1">{shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}</p>
        </div>
      )}

      {!shippingAddress && (
        <div className="text-center py-6 text-gray-500">
          <p>No address found. <button className="text-[#10b981] underline" onClick={() => router.push('/checkout')}>Go back</button></p>
        </div>
      )}

      <Button fullWidth onClick={handlePayment} disabled={!shippingAddress || isProcessing}>
        {isProcessing ? 'Processing Payment...' : `🔒 Pay Securely — ₹${grandTotal}`}
      </Button>
    </div>
  );
}
