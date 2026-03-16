'use client';

import React, { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { usePinLookup } from '@/hooks/usePinLookup';
import { validateEmail, validatePhoneNumber, validatePinCode, validateRequired } from '@/utils/validation';
import { Input } from './Input';
import { Button } from './Button';
import { Address } from '@/types';

type AddressFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  /** If provided, the form operates in edit mode for the given address */
  editAddress?: Address;
};

export function AddressForm({ onSuccess, onCancel, editAddress }: AddressFormProps) {
  const { addAddress, updateAddress, addresses } = useCheckout();
  const { lookupPin, pinLoading, pinError } = usePinLookup();
  const isEditMode = !!editAddress;

  const [formData, setFormData] = useState({
    fullName:      editAddress?.fullName      ?? '',
    email:         editAddress?.email         ?? '',
    phoneNumber:   editAddress?.phoneNumber   ?? '',
    streetAddress: editAddress?.streetAddress ?? '',
    pinCode:       editAddress?.pinCode       ?? '',
    city:          editAddress?.city          ?? '',
    state:         editAddress?.state         ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!validateRequired(formData.fullName)) newErrors.fullName = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhoneNumber(formData.phoneNumber)) newErrors.phoneNumber = 'Must be 10 digits';
    if (!validateRequired(formData.streetAddress)) newErrors.streetAddress = 'Address is required';
    if (!validatePinCode(formData.pinCode)) newErrors.pinCode = 'Must be 6 digits';
    if (!validateRequired(formData.city)) newErrors.city = 'City is required';
    if (!validateRequired(formData.state)) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    if (isEditMode) {
      updateAddress(editAddress!.id, formData);
    } else {
      const isDuplicate = addresses.some((addr) =>
        addr.streetAddress.toLowerCase().trim() === formData.streetAddress.toLowerCase().trim() &&
        addr.pinCode === formData.pinCode
      );
      if (isDuplicate) {
        setSubmitError('This address is already saved.');
        return;
      }
      addAddress(formData);
    }
    if (onSuccess) onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError(null);
  };

  const handlePinChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pinCode: pin, city: '', state: '' }));
    if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: '' }));

    if (pin.length === 6) {
      const result = await lookupPin(pin);
      if (result) {
        setFormData((prev) => ({ ...prev, pinCode: pin, city: result.city, state: result.state }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Address' : 'New Delivery Address'}
      </h2>
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {submitError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} required />
        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
        <Input label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} required />
        <div className="md:col-span-2">
          <Input label="Street Address" name="streetAddress" value={formData.streetAddress} onChange={handleChange} error={errors.streetAddress} required />
        </div>
        <div>
          <Input label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handlePinChange} error={errors.pinCode || pinError} required />
          {pinLoading && <p className="text-xs text-[#10b981] -mt-2 mb-2">🔍 Looking up location...</p>}
        </div>
        <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} required
          readOnly={pinLoading} className={formData.city && !errors.city ? 'bg-green-50 text-green-800' : ''} />
        <Input label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} required
          readOnly={pinLoading} className={formData.state && !errors.state ? 'bg-green-50 text-green-800' : ''} />
      </div>
      <div className="mt-8 flex gap-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={pinLoading} className="flex-1">Cancel</Button>
        )}
        <Button type="submit" disabled={pinLoading} className={onCancel ? "flex-1" : "w-full"}>
          {isEditMode ? 'Update Address' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
}
