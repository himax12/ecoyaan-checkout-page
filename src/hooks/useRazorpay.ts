'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type PaymentConfig = {
  amount: number;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (response: RazorpayResponse) => void;
  onFailure: (error: string) => void;
};

export function useRazorpay() {
  const initiatePayment = useCallback(async ({ amount, prefill, onSuccess, onFailure }: PaymentConfig) => {
    const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) return onFailure('Razorpay SDK failed to load.');

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) return onFailure('Could not create payment order.');

    const { orderId, amount: orderAmount, currency, key } = await res.json();

    const rzp = new window.Razorpay({
      key,
      amount: orderAmount,
      currency,
      name: 'Ecoyaan',
      description: 'Sustainable Shopping',
      order_id: orderId,
      prefill,
      theme: { color: '#10b981' },
      handler: onSuccess,
    });

    rzp.open();
  }, []);

  return { initiatePayment };
}
