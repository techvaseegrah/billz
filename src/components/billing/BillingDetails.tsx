/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/Input';

interface BillingDetails {
  id?: number;
  customerId?: number;
  billingName: string;
  billingPhone: string;
  billingEmail?: string;
  flatNo?: string;
  street?: string;
  district?: string;
  state?: string;
  pincode?: string;
  city?: string;
}

interface BillingFormProps {
  onBillingChange: (billing: BillingDetails | null) => void;
  onExistingBilling?: () => void;
}

const initialBillingState: BillingDetails = {
  id: undefined,
  customerId: undefined,
  billingName: '',
  billingPhone: '',
  billingEmail: '',
  flatNo: '',
  street: '',
  district: '',
  state: '',
  pincode: '',
  city: '',
};

async function getPincodeDetails(pincode: string) {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0].Status === 'Error') {
      throw new Error('Invalid pincode');
    }

    const postOffice = data[0].PostOffice[0];
    return {
      city: postOffice.Block || postOffice.Division,
      district: postOffice.District,
      state: postOffice.State,
    };
  } catch (error) {
    throw new Error('Failed to fetch pincode details');
  }
}

export const BillingDetailsForm = React.forwardRef<{ resetForm: () => void }, BillingFormProps>(
  ({ onBillingChange, onExistingBilling }, ref) => {
    const [phone, setPhone] = useState('');
    const [billingDetails, setBillingDetails] = useState<BillingDetails>(initialBillingState);
    const [isExistingBilling, setIsExistingBilling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPincodeLoading, setIsPincodeLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const pincodeInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    const debouncedPhone = useDebounce(phone, 200);
    const debouncedPincode = useDebounce(billingDetails?.pincode || '', 200);

    const resetForm = () => {
      setPhone('');
      setBillingDetails(initialBillingState);
      setIsExistingBilling(false);
      setError(null);
      setIsPincodeLoading(false);
      onBillingChange(null);
    };

    React.useImperativeHandle(ref, () => ({
      resetForm,
    }));

    useEffect(() => {
      const fetchBilling = async () => {
        if (debouncedPhone.length !== 10) {
          setIsExistingBilling(false);
          setBillingDetails(initialBillingState);
          onBillingChange(null);
          return;
        }

        if (billingDetails?.billingPhone !== debouncedPhone) {
          setBillingDetails({
            ...initialBillingState,
            billingPhone: debouncedPhone,
          });
          onBillingChange(null);
        }

        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/billingDet?q=${debouncedPhone}`);
          const text = await response.text();
          const data = text ? JSON.parse(text) : null;

          if (!response.ok) {
            if (response.status === 404) {
              setBillingDetails({
                ...initialBillingState,
                billingPhone: debouncedPhone,
              });
              setIsExistingBilling(false);
              onBillingChange(null);
              setTimeout(() => nameInputRef.current?.focus(), 100);
            } else {
              throw new Error(data?.message || 'Failed to fetch billing details');
            }
          } else {
            const exactMatch = data?.find(
              (entry: BillingDetails) => entry.billingPhone === debouncedPhone
            );
            if (exactMatch) {
              setBillingDetails(exactMatch);
              setIsExistingBilling(true);
              onBillingChange(exactMatch);
              onExistingBilling?.();
            } else {
              setBillingDetails({
                ...initialBillingState,
                billingPhone: debouncedPhone,
              });
              setIsExistingBilling(false);
              onBillingChange(null);
              setTimeout(() => nameInputRef.current?.focus(), 100);
            }
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch billing details');
          setBillingDetails({
            ...initialBillingState,
            billingPhone: debouncedPhone,
          });
          onBillingChange(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBilling();
    }, [debouncedPhone]);

    useEffect(() => {
      if (debouncedPincode.length !== 6) return;

      const fetchPincodeDetails = async () => {
        setIsPincodeLoading(true);
        try {
          const details = await getPincodeDetails(debouncedPincode);
          const updatedDetails = {
            ...billingDetails,
            district: details.district,
            state: details.state,
            city: details.city,
          };
          setBillingDetails(updatedDetails);
          onBillingChange(updatedDetails);
        } catch (error) {
          setError('Invalid pincode');
        } finally {
          setIsPincodeLoading(false);
        }
      };

      fetchPincodeDetails();
    }, [debouncedPincode]);

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      setPhone(value);
      if (value.length !== 10) {
        setBillingDetails({
          ...initialBillingState,
          billingPhone: value,
        });
      }
    };

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const updatedDetails = {
        ...billingDetails,
        [name]: value,
      };
      setBillingDetails(updatedDetails);
      onBillingChange(updatedDetails);
    };

    const handleKeyDown = (
      e: KeyboardEvent<HTMLInputElement>,
      nextRef?: React.RefObject<HTMLInputElement>
    ) => {
      if (e.key === 'Enter' && nextRef?.current) {
        e.preventDefault();
        nextRef.current.focus();
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number *"
            type="tel"
            placeholder="Enter 10 digit number"
            value={phone}
            onChange={handlePhoneChange}
            onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
            autoFocus
            required
            maxLength={10}
          />
          <Input
            ref={nameInputRef}
            label="Billing Name *"
            name="billingName"
            placeholder="Enter billing name"
            value={billingDetails.billingName}
            onChange={handleFieldChange}
            onKeyDown={(e) => handleKeyDown(e, pincodeInputRef)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Flat/House No"
            name="flatNo"
            placeholder="Enter flat/house number"
            value={billingDetails.flatNo ?? ''}
            onChange={handleFieldChange}
          />
          <Input
            label="Street"
            name="street"
            placeholder="Enter street name"
            value={billingDetails.street ?? ''}
            onChange={handleFieldChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            ref={pincodeInputRef}
            label="Pincode"
            name="pincode"
            placeholder="Enter 6 digit pincode"
            value={billingDetails.pincode ?? ''}
            onChange={handleFieldChange}
            onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
            maxLength={6}
          />
          <Input
            label="District"
            name="district"
            value={billingDetails.district ?? ''}
            onChange={handleFieldChange}
            disabled={isPincodeLoading}
          />
          <Input
            label="State"
            name="state"
            value={billingDetails.state ?? ''}
            onChange={handleFieldChange}
            disabled={isPincodeLoading}
          />
        </div>

        <div className="grid grid-cols-1">
          <Input
            ref={emailInputRef}
            label="Email (Optional)"
            name="billingEmail"
            type="email"
            placeholder="Enter email address"
            value={billingDetails.billingEmail ?? ''}
            onChange={handleFieldChange}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    );
  }
);

BillingDetailsForm.displayName = 'BillingDetailsForm';
