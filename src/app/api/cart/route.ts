import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mockData = {
      cartItems: [
        {
          product_id: 101,
          product_name: 'Bamboo Toothbrush (Pack of 4)',
          product_price: 299,
          quantity: 2,
          image: 'https://via.placeholder.com/150/10b981/FFFFFF?text=Toothbrush',
        },
        {
          product_id: 102,
          product_name: 'Reusable Cotton Produce Bags',
          product_price: 450,
          quantity: 1,
          image: 'https://via.placeholder.com/150/0891b2/FFFFFF?text=Bags',
        },
      ],
      shipping_fee: 50,
      discount_applied: 0,
    };

    return NextResponse.json({ success: true, data: mockData });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to retrieve cart data.' } },
      { status: 500 }
    );
  }
}
