'use client';

import React, { useEffect, useState } from 'react';
import type { StripeCountryFees } from '@/stores/fees';
import { ChevronDown } from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  MX: '🇲🇽',
  BR: '🇧🇷',
  AU: '🇦🇺',
};

interface CountrySelectorProps {
  value: string; // country_code (MX, BR, AU)
  onChange: (countryCode: string, currency: string) => void;
  label?: string;
  required?: boolean;
}

/**
 * Dropdown to select country and currency for a campaign
 * Loads supported countries from API
 */
export function CountrySelector({
  value,
  onChange,
  label = 'Country & Currency',
  required = true,
}: CountrySelectorProps) {
  const [countries, setCountries] = useState<StripeCountryFees[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/stripe-fees`);

        if (!response.ok) {
          throw new Error('Failed to load countries');
        }

        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (err) {
        setError((err as any).message || 'Failed to load countries');
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const selectedCountry = countries.find((c) => c.countryCode === value);

  const handleSelect = (country: StripeCountryFees) => {
    onChange(country.countryCode, country.currency);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {/* Dropdown button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-left text-sm font-medium transition-all hover:bg-gray-50 flex items-center justify-between"
          disabled={loading}
        >
          <span>
            {loading ? 'Loading...' : selectedCountry ? `${selectedCountry.countryName} (${selectedCountry.currency})` : 'Select country'}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Error message */}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

        {/* Dropdown menu */}
        {isOpen && !loading && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
              {countries.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No countries available
                </div>
              ) : (
                countries.map((country) => (
                  <button
                    key={country.countryCode}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                      value === country.countryCode
                        ? 'bg-blue-50 font-medium text-blue-700'
                        : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {COUNTRY_FLAGS[country.countryCode] || '🏳️'} {country.countryName}
                      </span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {country.currency}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {selectedCountry && (
        <p className="text-xs text-gray-500">
          Stripe fees will be calculated in {selectedCountry.currency}
        </p>
      )}
    </div>
  );
}
