'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressForm } from '@/components/AddressForm';
import { PriceSummary } from '@/components/PriceSummary';
import { StickyFooter } from '@/components/StickyFooter';
import { useCheckout } from '@/context/CheckoutContext';
import { Button } from '@/components/Button';

export default function CheckoutPage() {
  const { addresses, selectedAddressId, setSelectedAddress, deleteAddress, cartItems, shipping_fee, discount_applied } = useCheckout();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const isCartEmpty = cartItems.length === 0;
  const grandTotal = subtotal + (isCartEmpty ? 0 : shipping_fee) - discount_applied;

  const handleNext = () => {
    if (selectedAddressId && !isCartEmpty) {
      router.push('/payment');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen pb-32">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Delivery Address</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          
          {!showAddForm && addresses.length > 0 && (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedAddressId === addr.id 
                      ? 'border-[#10b981] bg-green-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(addr.id);
                      if (addresses.length <= 1) {
                        setShowAddForm(true);
                      }
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white rounded p-1"
                    aria-label="Delete address"
                    title="Delete address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                  <div className="flex items-start gap-3 pr-8">
                    <div className="pt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedAddressId === addr.id ? 'border-[#10b981]' : 'border-gray-300'
                      }`}>
                        {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{addr.fullName}</h3>
                      <p className="text-gray-700 mt-1">{addr.streetAddress}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{addr.city}, {addr.state} — {addr.pinCode}</p>
                      <p className="text-gray-500 text-sm mt-1">{addr.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="secondary" fullWidth onClick={() => setShowAddForm(true)} className="mt-4 border-dashed border-2 py-4">
                + Add a new address
              </Button>
            </div>
          )}

          {showAddForm && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <AddressForm 
                onSuccess={() => setShowAddForm(false)} 
                onCancel={addresses.length > 0 ? () => setShowAddForm(false) : undefined} 
              />
            </div>
          )}
        </div>

        <div className="w-full lg:w-96 hidden lg:block">
           <div className="sticky top-6">
             <PriceSummary />
           </div>
        </div>
      </div>

      <StickyFooter 
        onNext={handleNext} 
        nextLabel="Continue to Payment" 
        nextDisabled={!selectedAddressId || isCartEmpty || showAddForm}
        price={grandTotal}
      />
    </div>
  );
}
