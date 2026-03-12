export type CartItem = {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
};

export type CheckoutContextType = {
  cartItems: CartItem[];
  shipping_fee: number;
  discount_applied: number;
};
