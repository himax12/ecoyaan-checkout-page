'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CheckoutContextType, Address } from '@/types';

type ContextValue = CheckoutContextType & {
  addresses: Address[];
  selectedAddressId: string | null;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (id: string | null) => void;
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ecoyaan_cart');
      const savedAddresses = localStorage.getItem('ecoyaan_addresses');
      const savedSelectedId = localStorage.getItem('ecoyaan_selected_address_id');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        // Pre-select the first inserted array if not selected
        if (!savedSelectedId && parsedAddresses.length > 0) {
            setSelectedAddressId(parsedAddresses[0].id);
        }
      }
      if (savedSelectedId) {
        setSelectedAddressId(savedSelectedId);
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
      localStorage.setItem('ecoyaan_addresses', JSON.stringify(addresses));
      if (selectedAddressId) {
        localStorage.setItem('ecoyaan_selected_address_id', selectedAddressId);
      } else {
        localStorage.removeItem('ecoyaan_selected_address_id');
      }
    }
  }, [addresses, selectedAddressId, isInitialized]);

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newId = Date.now().toString();
    const newAddress = { ...address, id: newId };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newId);
  };

  const updateAddress = (id: string, updatedFields: Omit<Address, 'id'>) => {
    setAddresses((prev) => prev.map((addr) => (addr.id === id ? { ...updatedFields, id } : addr)));
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }
  };

  const setSelectedAddress = (id: string | null) => {
    setSelectedAddressId(id);
  };

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
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
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
