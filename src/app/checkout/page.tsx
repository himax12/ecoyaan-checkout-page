'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressForm } from '@/components/AddressForm';
import { PriceSummary } from '@/components/PriceSummary';
import { StickyFooter } from '@/components/StickyFooter';
import { UserBadge } from '@/components/UserBadge';
import { useCheckout } from '@/context/CheckoutContext';
import { Button } from '@/components/Button';
import { Address } from '@/types';

export default function CheckoutPage() {
  const { addresses, selectedAddressId, setSelectedAddress, deleteAddress, cartItems, shipping_fee, discount_applied } = useCheckout();
  const router = useRouter();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const isCartEmpty = cartItems.length === 0;
  const grandTotal = subtotal + (isCartEmpty ? 0 : shipping_fee) - discount_applied;

  const handleNext = () => {
    if (selectedAddressId && !isCartEmpty) {
      router.push('/payment');
    }
  };

  const handleStartEdit = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setShowAddForm(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAddress(id);
    if (editingAddress?.id === id) setEditingAddress(null);
  };

  const isFormVisible = showAddForm || !!editingAddress;
  const noAddresses = addresses.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen pb-32">

      {/* Header row with title + user badge */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Address</h1>
        <UserBadge />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">

          {/* Address list */}
          {!isFormVisible && addresses.length > 0 && (
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
                  {/* Action buttons — Edit & Delete */}
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      onClick={(e) => handleStartEdit(addr, e)}
                      className="text-gray-400 hover:text-blue-500 transition-colors bg-white rounded p-1"
                      aria-label="Edit address"
                      title="Edit address"
                    >
                      {/* Pencil icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(addr.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded p-1"
                      aria-label="Delete address"
                      title="Delete address"
                    >
                      {/* Trash icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-start gap-3 pr-16">
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

              <Button
                variant="secondary"
                fullWidth
                onClick={() => { setShowAddForm(true); setEditingAddress(null); }}
                className="mt-4 border-dashed border-2 py-4"
              >
                + Add a new address
              </Button>
            </div>
          )}

          {/* No addresses yet — show blank add form directly */}
          {noAddresses && !isFormVisible && (
            <div className="animate-in fade-in duration-300">
              <AddressForm onSuccess={() => {}} />
            </div>
          )}

          {/* Add new address form */}
          {showAddForm && !editingAddress && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <AddressForm
                onSuccess={() => setShowAddForm(false)}
                onCancel={addresses.length > 0 ? () => setShowAddForm(false) : undefined}
              />
            </div>
          )}

          {/* Edit existing address form */}
          {editingAddress && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <AddressForm
                editAddress={editingAddress}
                onSuccess={() => setEditingAddress(null)}
                onCancel={() => setEditingAddress(null)}
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
        nextDisabled={!selectedAddressId || isCartEmpty || isFormVisible}
        price={grandTotal}
      />
    </div>
  );
}
