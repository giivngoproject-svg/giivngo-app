'use client';

import { Country } from '@/lib/types';
import { useCountries } from '@/hooks/useCountries';
import { Globe } from 'lucide-react';

interface CountrySelectorProps {
  value: string;
  onChange: (countryCode: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export function CountrySelector({
  value,
  onChange,
  label = 'Country',
  disabled = false,
  required = false,
}: CountrySelectorProps) {
  const { countries, isLoading, error } = useCountries();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Globe size={16} className="text-gray-400" />
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          required={required}
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 appearance-none bg-white"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            paddingRight: '32px',
          }}
        >
          <option value="">
            {isLoading ? 'Loading countries...' : 'Select a country'}
          </option>
          {countries.map((country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {country.countryName} ({country.currency})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
