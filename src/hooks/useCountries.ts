import { useState, useEffect } from 'react';
import { Country } from '@/lib/types';
import { profileApi } from '@/lib/api';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await profileApi.getCountries();
        setCountries(data);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
}
