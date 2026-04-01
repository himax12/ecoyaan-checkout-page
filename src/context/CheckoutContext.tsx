"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, CheckoutContextType, Address } from "@/types";

const MOCK_ADDRESSES: Address[] = [
  {
    id: "mock-addr-001",
    fullName: "Priya Sharma",
    email: "priya.sharma@ecoyaan.com",
    phoneNumber: "9876543210",
    streetAddress: "42, Green Valley Apartments, MG Road",
    pinCode: "560001",
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    id: "mock-addr-002",
    fullName: "Priya Sharma",
    email: "priya.sharma@ecoyaan.com",
    phoneNumber: "9876543210",
    streetAddress: "7, Sunrise Tower, Andheri West",
    pinCode: "400053",
    city: "Mumbai",
    state: "Maharashtra",
  },
];

const ECOYAAN5_COUPON = "ECOYAAN5";
const ECOYAAN5_MIN_ORDER = 250;
const ECOYAAN5_DISCOUNT_RATE = 0.05;
const ECOYAAN5_MAX_DISCOUNT = 100;
const COUPON_PERSISTENCE_WARNING =
  "Coupon applied for now, but could not be saved because browser storage is full.";

const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((acc, item) => acc + item.product_price * item.quantity, 0);

const getEcoayaan5Discount = (subtotal: number) =>
  Math.min(
    Math.round(subtotal * ECOYAAN5_DISCOUNT_RATE),
    ECOYAAN5_MAX_DISCOUNT,
  );

type StorageWriteResult = {
  success: boolean;
  quotaExceeded: boolean;
};

const isQuotaExceededError = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED");

const setStorageItemSafely = (
  key: string,
  value: string,
): StorageWriteResult => {
  try {
    localStorage.setItem(key, value);
    return { success: true, quotaExceeded: false };
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.warn(`Storage quota exceeded while writing ${key}.`, error);
      return { success: false, quotaExceeded: true };
    }

    console.warn(`Could not persist localStorage key ${key}.`, error);
    return { success: false, quotaExceeded: false };
  }
};

const removeStorageItemSafely = (key: string): StorageWriteResult => {
  try {
    localStorage.removeItem(key);
    return { success: true, quotaExceeded: false };
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.warn(`Storage quota exceeded while removing ${key}.`, error);
      return { success: false, quotaExceeded: true };
    }

    console.warn(`Could not remove localStorage key ${key}.`, error);
    return { success: false, quotaExceeded: false };
  }
};

type CouponValidationResult = {
  valid: boolean;
  message: string;
  normalizedCode?: string;
};

type ContextValue = CheckoutContextType & {
  addresses: Address[];
  selectedAddressId: string | null;
  appliedCouponCode: string | null;
  couponPersistenceWarning: string | null;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (id: string | null) => void;
  updateQuantity: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
  validateCoupon: (couponCode: string) => CouponValidationResult;
  applyCoupon: (couponCode: string) => { success: boolean; message: string };
  removeCoupon: () => void;
};

const CheckoutContext = createContext<ContextValue | undefined>(undefined);

export function CheckoutProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: CheckoutContextType;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialData.cartItems);
  const [discountApplied, setDiscountApplied] = useState<number>(
    initialData.discount_applied,
  );
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [couponPersistenceWarning, setCouponPersistenceWarning] = useState<
    string | null
  >(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ecoyaan_cart");
      const savedAddresses = localStorage.getItem("ecoyaan_addresses");
      const savedSelectedId = localStorage.getItem(
        "ecoyaan_selected_address_id",
      );
      const savedDiscount = localStorage.getItem("ecoyaan_discount_applied");
      const savedCoupon = localStorage.getItem("ecoyaan_applied_coupon");

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      if (savedDiscount !== null) {
        const parsedDiscount = Number(savedDiscount);
        if (Number.isFinite(parsedDiscount) && parsedDiscount >= 0) {
          setDiscountApplied(parsedDiscount);
        }
      }

      if (savedCoupon && savedCoupon.trim().toUpperCase() === ECOYAAN5_COUPON) {
        setAppliedCouponCode(ECOYAAN5_COUPON);
      }

      // If no saved addresses yet, seed with mock data for the demo
      const addrToLoad: Address[] = savedAddresses
        ? JSON.parse(savedAddresses)
        : MOCK_ADDRESSES;

      setAddresses(addrToLoad);

      if (savedSelectedId) {
        setSelectedAddressId(savedSelectedId);
      } else if (addrToLoad.length > 0) {
        setSelectedAddressId(addrToLoad[0].id);
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when state changes (only after initial load)
  useEffect(() => {
    if (isInitialized) {
      const result = setStorageItemSafely(
        "ecoyaan_cart",
        JSON.stringify(cartItems),
      );
      if (!result.success) {
        console.warn("Could not persist cart state.");
      }
    }
  }, [cartItems, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const discountResult = setStorageItemSafely(
        "ecoyaan_discount_applied",
        String(discountApplied),
      );

      let couponResult: StorageWriteResult = {
        success: true,
        quotaExceeded: false,
      };

      if (appliedCouponCode) {
        couponResult = setStorageItemSafely(
          "ecoyaan_applied_coupon",
          appliedCouponCode,
        );

        if (discountResult.quotaExceeded || couponResult.quotaExceeded) {
          setCouponPersistenceWarning(COUPON_PERSISTENCE_WARNING);
        } else if (discountResult.success && couponResult.success) {
          setCouponPersistenceWarning(null);
        }
      } else {
        couponResult = removeStorageItemSafely("ecoyaan_applied_coupon");
        setCouponPersistenceWarning(null);
      }

      if (!discountResult.success || !couponResult.success) {
        console.warn("Could not fully persist coupon state.");
      }
    }
  }, [discountApplied, appliedCouponCode, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const addressesResult = setStorageItemSafely(
        "ecoyaan_addresses",
        JSON.stringify(addresses),
      );

      if (selectedAddressId) {
        const selectedAddressResult = setStorageItemSafely(
          "ecoyaan_selected_address_id",
          selectedAddressId,
        );
        if (!addressesResult.success || !selectedAddressResult.success) {
          console.warn("Could not fully persist address selection state.");
        }
      } else {
        const removeResult = removeStorageItemSafely(
          "ecoyaan_selected_address_id",
        );
        if (!addressesResult.success || !removeResult.success) {
          console.warn("Could not fully persist address state.");
        }
      }
    }
  }, [addresses, selectedAddressId, isInitialized]);

  const addAddress = (address: Omit<Address, "id">) => {
    const newId = Date.now().toString();
    const newAddress = { ...address, id: newId };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newId);
  };

  const updateAddress = (id: string, updatedFields: Omit<Address, "id">) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...updatedFields, id } : addr)),
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }
  };

  const setSelectedAddress = (id: string | null) => {
    setSelectedAddressId(id);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== id));
  };

  const validateCoupon = (couponCode: string): CouponValidationResult => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        valid: false,
        message: "Please enter a coupon code.",
      };
    }

    if (normalizedCode !== ECOYAAN5_COUPON) {
      return {
        valid: false,
        message: "This coupon code is not available.",
      };
    }

    const subtotal = getCartSubtotal(cartItems);
    if (subtotal < ECOYAAN5_MIN_ORDER) {
      return {
        valid: false,
        message: `Minimum order of ₹${ECOYAAN5_MIN_ORDER} required for ${ECOYAAN5_COUPON}.`,
      };
    }

    return {
      valid: true,
      message: `${ECOYAAN5_COUPON} is valid.`,
      normalizedCode,
    };
  };

  const applyCoupon = (couponCode: string) => {
    const validation = validateCoupon(couponCode);
    if (!validation.valid || !validation.normalizedCode) {
      return {
        success: false,
        message: validation.message,
      };
    }

    const subtotal = getCartSubtotal(cartItems);
    const discount = getEcoayaan5Discount(subtotal);

    setDiscountApplied(discount);
    setAppliedCouponCode(validation.normalizedCode);

    return {
      success: true,
      message: `${validation.normalizedCode} applied successfully.`,
    };
  };

  const removeCoupon = () => {
    setDiscountApplied(0);
    setAppliedCouponCode(null);
    setCouponPersistenceWarning(null);
  };

  useEffect(() => {
    if (!isInitialized || appliedCouponCode !== ECOYAAN5_COUPON) {
      return;
    }

    const subtotal = getCartSubtotal(cartItems);

    if (subtotal < ECOYAAN5_MIN_ORDER) {
      setDiscountApplied(0);
      setAppliedCouponCode(null);
      return;
    }

    const recalculatedDiscount = getEcoayaan5Discount(subtotal);
    if (recalculatedDiscount !== discountApplied) {
      setDiscountApplied(recalculatedDiscount);
    }
  }, [cartItems, appliedCouponCode, discountApplied, isInitialized]);

  const value = {
    cartItems,
    shipping_fee: initialData.shipping_fee,
    discount_applied: discountApplied,
    addresses,
    selectedAddressId,
    appliedCouponCode,
    couponPersistenceWarning,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    updateQuantity,
    removeItem,
    validateCoupon,
    applyCoupon,
    removeCoupon,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
