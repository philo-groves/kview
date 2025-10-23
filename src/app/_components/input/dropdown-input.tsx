"use client"

import { brand_font } from '@/app/fonts';
import React, { useState } from 'react';

import Select from 'react-select';

const Checkbox = ({ children, ...props }: React.JSX.IntrinsicElements['input']) => (
  <label style={{ marginRight: '1em' }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

type Props = {
  name: string;
  label?: string;
  options: DropdownInputOption[];
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

export default function DropdownInput({ name, label, options, multiple, disabled, loading, value, onChange }: Props) {
  // Deduplicate options to prevent duplicate entries
  const uniqueOptions = options.filter((option, index, self) => 
    index === self.findIndex(o => o.value === option.value)
  );

  // Deduplicate value array for multi-select
  const normalizedValue = multiple && Array.isArray(value) 
    ? [...new Set(value)] 
    : value;

  return (
    <div className="relative">
      <Select
        className="basic-single"
        classNamePrefix="select"
        isDisabled={disabled}
        isLoading={loading}
        isClearable={true}
        name={name}
        options={uniqueOptions}
        isMulti={multiple}
        value={uniqueOptions.filter(option => 
          multiple
            ? Array.isArray(normalizedValue) && normalizedValue.includes(option.value)
            : option.value === normalizedValue
        )}
        onChange={(selectedOption) => {
          if (multiple) {
            const values = (selectedOption as DropdownInputOption[] | null)?.map(option => option.value) || [];
            // Ensure no duplicates in the output
            const uniqueValues = [...new Set(values)];
            onChange?.(uniqueValues);
          } else {
            onChange?.((selectedOption as DropdownInputOption | null)?.value || "");
          }
        }}
      />
      <span className={`absolute top-1.5 left-3 ${brand_font.className}`}>{label}</span>
    </div>
  );
}

export type DropdownInputOption = {
  value: string;
  label: string;
}