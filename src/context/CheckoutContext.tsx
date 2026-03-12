'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CheckoutContextType } from '@/types';

type ShippingAddress = {
  fullName: string;
  email: string;
  phoneNumber: string;
  pinCode: string;
  city: string;
  state: string;
};

type ContextValue = CheckoutContextType & {
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  updateQuantity: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
};

const CheckoutContext = createContext<ContextValue | undefined>(undefined);

export function CheckoutProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: CheckoutContextType;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialData.cartItems);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ecoyaan_cart');
      const savedAddress = localStorage.getItem('ecoyaan_address');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress));
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when state changes (only after initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ecoyaan_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (shippingAddress) {
        localStorage.setItem('ecoyaan_address', JSON.stringify(shippingAddress));
      } else {
        localStorage.removeItem('ecoyaan_address');
      }
    }
  }, [shippingAddress, isInitialized]);

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product_id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== id));
  };

  const value = {
    cartItems,
    shipping_fee: initialData.shipping_fee,
    discount_applied: initialData.discount_applied,
    shippingAddress,
    setShippingAddress,
    updateQuantity,
    removeItem,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
