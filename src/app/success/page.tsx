import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Successful! 🌱</h1>
        <p className="text-gray-500 mb-8">
          Thank you for choosing Ecoyaan! Your order has been placed and will be delivered soon.
          Together we are making the planet a little greener.
        </p>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 text-left space-y-2">
          <p className="text-sm text-gray-500">What happens next?</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2 items-center"><span className="text-[#10b981]">✓</span> Order confirmation email sent</li>
            <li className="flex gap-2 items-center"><span className="text-[#10b981]">✓</span> Eco-friendly packaging in progress</li>
            <li className="flex gap-2 items-center"><span className="text-[#10b981]">✓</span> Estimated delivery in 3–5 business days</li>
          </ul>
        </div>

        <Link href="/" className="bg-[#10b981] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#059669] transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
