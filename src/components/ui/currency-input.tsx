'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  isCurrency?: boolean;
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-NG');
}

function parseNumber(str: string): number {
  const cleaned = str.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function CurrencyInput({ value, onChange, isCurrency = true, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(formatNumber(value));

  React.useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseNumber(rawValue);
    setDisplayValue(formatNumber(numericValue));
    onChange(numericValue);
  };

  return (
    <div className="relative">
      {isCurrency && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
      )}
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn('text-right font-mono', isCurrency ? 'pl-8' : 'px-3', className)}
      />
    </div>
  );
}
