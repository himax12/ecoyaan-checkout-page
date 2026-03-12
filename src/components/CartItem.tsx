import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCheckout } from '@/context/CheckoutContext';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCheckout();

  return (
    <div className="flex gap-4 p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center p-2 text-center text-xs">
        <Image src={item.image} alt={item.product_name} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-1 pl-2">
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 font-medium text-sm md:text-base leading-tight">
            {item.product_name}
          </h3>
          <button 
            onClick={() => removeItem(item.product_id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div className="mt-1">
          <span className="text-lg font-bold text-gray-900">₹{item.product_price}</span>
        </div>
        <div className="mt-auto flex items-center pt-2">
          <div className="flex items-center border border-gray-200 rounded-md">
            <button 
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              className="px-3 py-1 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center font-medium"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="px-4 py-1 text-sm font-medium border-x border-gray-200">
              {item.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center font-medium"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
