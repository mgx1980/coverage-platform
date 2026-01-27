import useSWR from 'swr';
import type { CoverageFilters } from '@/types/coverage';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCoverageFilters() {
  const { data, error, isLoading } = useSWR<CoverageFilters>(
    '/api/coverage/filters',
    fetcher,
    { revalidateOnFocus: false }
  );

  return { filters: data, error, isLoading };
}
