import Image from "next/image";
import { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const DEFAULT_COUPON_CODE = "ECOYAAN5";
const DEFAULT_COUPON_MIN_ORDER = 250;
const DEFAULT_COUPON_BADGE = "5% OFF upto ₹100";

export function PriceSummary() {
  const {
    cartItems,
    shipping_fee,
    discount_applied,
    appliedCouponCode,
    couponPersistenceWarning,
    validateCoupon,
    applyCoupon,
    removeCoupon,
  } = useCheckout();

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isCouponValid, setIsCouponValid] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0,
  );
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isCartEmpty = cartItems.length === 0;
  const actualShipping = isCartEmpty ? 0 : shipping_fee;
  const safeDiscount = Math.min(discount_applied, subtotal);
  const grandTotal = Math.max(0, subtotal + actualShipping - safeDiscount);
  const estimatedTaxes = Math.round(grandTotal * 0.05);
  const isDefaultCouponApplied =
    appliedCouponCode === DEFAULT_COUPON_CODE && safeDiscount > 0;

  const primaryItem = cartItems[0];
  const remainingItemCount = Math.max(0, cartItems.length - 1);

  const primaryItemDiscountShare =
    primaryItem && totalQuantity > 0
      ? Math.round((safeDiscount / totalQuantity) * primaryItem.quantity)
      : 0;

  const discountedUnitPrice =
    primaryItem && primaryItem.quantity > 0
      ? Math.max(
          0,
          primaryItem.product_price -
            Math.round(primaryItemDiscountShare / primaryItem.quantity),
        )
      : 0;

  const openCouponModal = () => {
    setCouponInput(appliedCouponCode ?? "");
    setCouponMessage(null);
    setIsCouponValid(false);
    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
    setCouponMessage(null);
    setIsCouponValid(false);
  };

  const handleCheckCoupon = () => {
    const validation = validateCoupon(couponInput);
    setCouponMessage(validation.message);
    setIsCouponValid(validation.valid);
  };

  const handleApplyCoupon = () => {
    const codeToApply = couponInput.trim() || DEFAULT_COUPON_CODE;
    const result = applyCoupon(codeToApply);
    setCouponMessage(result.message);
    setIsCouponValid(result.success);

    if (result.success) {
      closeCouponModal();
    }
  };

  const handleCouponInputChange = (value: string) => {
    setCouponInput(value.toUpperCase());
    setCouponMessage(null);
    setIsCouponValid(false);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-6">
      <h2 className="mb-6 text-4xl font-semibold text-gray-900">
        Order Summary
      </h2>

      {primaryItem ? (
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <Image
              src={primaryItem.image}
              alt={primaryItem.product_name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-2xl font-medium leading-tight text-gray-900">
              {primaryItem.product_name}
            </p>
            <div className="mt-2 flex items-center gap-2 text-base">
              {safeDiscount > 0 && (
                <span className="text-gray-400 line-through">
                  {formatCurrency(primaryItem.product_price)} x{" "}
                  {primaryItem.quantity}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                {formatCurrency(
                  safeDiscount > 0
                    ? discountedUnitPrice
                    : primaryItem.product_price,
                )}{" "}
                x {primaryItem.quantity}
              </span>
            </div>
            {isDefaultCouponApplied && (
              <>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  5% off applied
                </p>
                <p className="text-sm font-semibold text-emerald-700">
                  {DEFAULT_COUPON_CODE}
                </p>
              </>
            )}
            {remainingItemCount > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                +{remainingItemCount} more item
                {remainingItemCount > 1 ? "s" : ""} in your cart
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
          Your cart is empty. Add products to see a full price breakdown.
        </p>
      )}

      <div className="mt-6 space-y-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={openCouponModal}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              %
            </span>
            <span className="text-lg font-medium text-gray-800">
              Offers & Coupons
            </span>
          </div>
          <span className="text-2xl text-gray-500">&gt;</span>
        </button>

        {isDefaultCouponApplied ? (
          <div className="flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                %
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {DEFAULT_COUPON_CODE}
                  </p>
                  <span className="rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-xs font-medium text-emerald-700">
                    5% OFF
                  </span>
                </div>
                <p className="text-xl text-emerald-700">
                  You saved {formatCurrency(safeDiscount)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Remove applied coupon"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
            Apply{" "}
            <span className="font-semibold text-emerald-700">
              {DEFAULT_COUPON_CODE}
            </span>{" "}
            to unlock discount.
          </div>
        )}

        {couponPersistenceWarning && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {couponPersistenceWarning}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-xl text-gray-800">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>
        {safeDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span>Coupon Discount</span>
            <span className="font-medium text-emerald-700">
              - {formatCurrency(safeDiscount)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          {actualShipping === 0 ? (
            <span className="font-medium text-emerald-700">Free</span>
          ) : (
            <span className="font-medium text-gray-900">
              {formatCurrency(actualShipping)}
            </span>
          )}
        </div>
        <p className="pt-1 text-lg font-semibold text-sky-600">
          Own a business? Enter your GSTIN!
        </p>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-4xl font-semibold text-gray-900">You Pay</span>
          <span className="text-5xl font-bold text-gray-900">
            {formatCurrency(grandTotal)}
          </span>
        </div>
        <p className="mt-1 text-right text-xl font-medium text-gray-500">
          Including {formatCurrency(estimatedTaxes)} in taxes
        </p>
      </div>

      {isCouponModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 sm:items-center"
          onClick={closeCouponModal}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-center text-4xl font-semibold text-gray-900">
              Available Coupons
            </h3>

            <div className="mt-5 flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(event) =>
                  handleCouponInputChange(event.target.value)
                }
                placeholder="Enter coupon code"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-lg text-gray-900 outline-none transition focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleCheckCoupon}
                className="h-12 rounded-lg bg-emerald-600 px-6 text-lg font-semibold text-white transition hover:bg-emerald-700"
              >
                Check
              </button>
            </div>

            {couponMessage && (
              <p
                className={`mt-2 text-sm ${isCouponValid ? "text-emerald-700" : "text-red-600"}`}
              >
                {couponMessage}
              </p>
            )}

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-4xl font-semibold text-gray-900">
                      {DEFAULT_COUPON_CODE}
                    </p>
                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700">
                      {DEFAULT_COUPON_BADGE}
                    </span>
                  </div>
                  <p className="mt-2 text-lg text-gray-600">
                    Min order: {formatCurrency(DEFAULT_COUPON_MIN_ORDER)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isDefaultCouponApplied}
                  className="rounded-xl border border-emerald-600 px-5 py-2 text-2xl font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                >
                  {isDefaultCouponApplied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
