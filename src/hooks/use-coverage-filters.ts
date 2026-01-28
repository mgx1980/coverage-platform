import useSWR from 'swr';
import type { CoverageFilters } from '@/types/coverage';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch');
  }
  return res.json();
};

export function useCoverageFilters() {
  const { data, error, isLoading } = useSWR<CoverageFilters>(
    '/api/coverage/filters',
    fetcher,
    { revalidateOnFocus: false }
  );

  return { filters: data, error, isLoading };
}
