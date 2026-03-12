export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const validatePinCode = (pin: string): boolean => {
  return /^\d{6}$/.test(pin);
};

export const validateRequired = (value: string | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  return value.trim().length > 0;
};
