# Ecoyaan Checkout Flow

A simplified checkout flow built for the Ecoyaan frontend engineering assignment.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (Ecoyaan brand colors)
- **State**: React Context API
- **Language**: TypeScript
- **Data**: Mock via SSR in Root Layout

## Architecture
Strict module boundaries — every file is ≤ 100 LOC.

```
src/
├── app/
│   ├── layout.tsx          # Root SSR layout with CheckoutProvider
│   ├── ClientLayout.tsx    # Client boundary injecting SSR data into Context  
│   ├── page.tsx            # Cart screen (/)
│   ├── CartPageClient.tsx  # Cart UI client component
│   ├── checkout/page.tsx   # Address form (/checkout)
│   ├── payment/page.tsx    # Order review (/payment)
│   ├── success/page.tsx    # Success (/success)
│   └── api/cart/route.ts   # Mock REST API
├── components/
│   ├── Button.tsx          # Reusable CTA button
│   ├── Input.tsx           # Reusable form input with error state
│   ├── CartItem.tsx        # Cart row with quantity controls
│   ├── PriceSummary.tsx    # Sticky sidebar with totals
│   ├── AddressForm.tsx     # Shipping form + inline validation
│   └── OrderReview.tsx     # Payment review card
├── context/
│   └── CheckoutContext.tsx # Global cart + address state
└── types/
    └── index.ts            # Shared TypeScript types
```

## SSR Data Fetching
Cart data is fetched in the root `layout.tsx` as an `async` Server Component and passed to the `ClientLayout` which hydrates the React Context. All child routes (`/checkout`, `/payment`) share the same context instance.

## Form Validation
Handled in `AddressForm.tsx` with plain React state:
- Required fields checked before submission
- Email: regex `/^\S+@\S+\.\S+$/`
- Phone: digits only, exactly 10 chars `/^\d{10}$/`
- PIN Code: digits only, exactly 6 chars `/^\d{6}$/`

## Running Locally

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Flow

```
/ (Cart)  →  /checkout (Address)  →  /payment (Review)  →  /success
```
