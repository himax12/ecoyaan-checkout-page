import { useCheckout } from '@/context/CheckoutContext';
import { Button } from './Button';

export function PriceSummary({ onProceed, ctaText = 'Proceed to Checkout' }: { onProceed: () => void, ctaText?: string }) {
  const { cartItems, shipping_fee, discount_applied } = useCheckout();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
  const isCartEmpty = cartItems.length === 0;
  const actualShipping = isCartEmpty ? 0 : shipping_fee;
  const grandTotal = subtotal + actualShipping - discount_applied;

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Total items: {cartItems.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-medium text-gray-900">₹{subtotal}</span>
        </div>
        {discount_applied > 0 && (
          <div className="flex justify-between text-[#10b981]">
            <span>Discount:</span>
            <span>- ₹{discount_applied}</span>
          </div>
        )}
        <div className="flex justify-between pb-4 border-b border-gray-100">
          <span>Delivery Fee:</span>
          {actualShipping === 0 ? (
            <span className="text-[#10b981] font-medium">Free Delivery</span>
          ) : (
            <span className="font-medium text-gray-900">₹{actualShipping}</span>
          )}
        </div>
        
        <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 mt-2">
          <span>Grand Total:</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      <div className="mt-8">
        <Button 
          fullWidth 
          onClick={onProceed} 
          disabled={isCartEmpty}
          className={isCartEmpty ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
