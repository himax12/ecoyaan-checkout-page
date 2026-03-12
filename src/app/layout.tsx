import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { CheckoutContextType } from "@/types";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecoyaan Checkout",
  description: "Sustainable shopping, delivered.",
};

async function fetchCartData(): Promise<CheckoutContextType> {
  return {
    cartItems: [
      { product_id: 101, product_name: "Bamboo Toothbrush (Pack of 4)", product_price: 299, quantity: 2, image: "/images/toothbrush.png" },
      { product_id: 102, product_name: "Reusable Cotton Produce Bags", product_price: 450, quantity: 1, image: "/images/bag.png" },
    ],
    shipping_fee: 50,
    discount_applied: 0,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData = await fetchCartData();

  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased bg-[#f8fafc]`}>
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="text-[#10b981] font-bold text-2xl tracking-tight">🌱 Ecoyaan</div>
          <span className="text-sm text-gray-500">Sustainability made easy</span>
        </header>
        <ClientLayout initialData={initialData}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

