// components/ui/Checkbox.tsx
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  className = '',
  ...props
}: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
};