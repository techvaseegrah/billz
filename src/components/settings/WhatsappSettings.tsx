// components/settings/WhatsAppSettings.tsx
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import React from 'react';  

interface WhatsAppSettings {
  initialNumber: string;
  initialWabaToken?: string;
  initialWaAccessToken?: string;
  initialWaKey?: string;
  onSuccess: () => void;
}

export function WhatsAppSettings({
  initialNumber,
  initialWabaToken = '',
  initialWaAccessToken = '',
  initialWaKey = '',
  onSuccess,
}: WhatsAppSettings) {
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(initialNumber);
  const [wabaToken, setWabaToken] = useState(initialWabaToken);
  const [waAccessToken, setWaAccessToken] = useState(initialWaAccessToken);
  const [waKey, setWaKey] = useState(initialWaKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\d{10}$/.test(whatsappNumber)) {
      toast.error('Please enter a valid 10-digit number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/settings/shop', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          whatsappNumber,
          wabaToken,
          waAccessToken,
          waKey
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update WhatsApp settings');
      }

      if (result.success) {
        toast.success(result.message || 'WhatsApp settings updated successfully');
        onSuccess();
      } else {
        throw new Error(result.error || 'Failed to update WhatsApp settings');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-w-md space-y-4">
        <Input
          label="WhatsApp Number"
          type="tel"
          value={whatsappNumber}
          onChange={(e) => handleInputChange(e, setWhatsappNumber)}
          placeholder="Enter 10-digit phone number"
          pattern="\d{10}"
          required
        />

        <Input
          label="WABA Token"
          type="text"
          value={wabaToken}
          onChange={(e) => handleInputChange(e, setWabaToken)}
          placeholder="Enter WABA Token"
        />

        <Input
          label="Access Token"
          type="text"
          value={waAccessToken}
          onChange={(e) => handleInputChange(e, setWaAccessToken)}
          placeholder="Enter Access Token"
        />

        <Input
          label="WA Key"
          type="text"
          value={waKey}
          onChange={(e) => handleInputChange(e, setWaKey)}
          placeholder="Enter WA Key"
        />
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" isLoading={isLoading}>
          Update Settings
        </Button>
      </div>
    </form>
  );
}