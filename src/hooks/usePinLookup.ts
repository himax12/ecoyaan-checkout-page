'use client';

import { useState, useCallback } from 'react';

type PinResult = {
  city: string;
  state: string;
};

type UsePinLookupReturn = {
  lookupPin: (pin: string) => Promise<PinResult | null>;
  pinLoading: boolean;
  pinError: string;
};

export function usePinLookup(): UsePinLookupReturn {
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');

  const lookupPin = useCallback(async (pin: string): Promise<PinResult | null> => {
    if (!/^\d{6}$/.test(pin)) return null;

    setPinLoading(true);
    setPinError('');

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();

      // API returns: [{ Status, PostOffice: [{ Name, District, State }] }]
      if (data[0]?.Status !== 'Success' || !data[0]?.PostOffice?.length) {
        setPinError('Invalid PIN code');
        return null;
      }

      const postOffice = data[0].PostOffice[0];
      return {
        city: postOffice.District,
        state: postOffice.State,
      };
    } catch {
      setPinError('Could not fetch location. Please enter manually.');
      return null;
    } finally {
      setPinLoading(false);
    }
  }, []);

  return { lookupPin, pinLoading, pinError };
}
