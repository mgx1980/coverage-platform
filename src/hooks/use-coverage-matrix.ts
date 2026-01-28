import useSWR from 'swr';
import type { FilterState, CoverageMatrixResponse } from '@/types/coverage';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch');
  }
  return res.json();
};

function buildUrl(filterState: FilterState): string {
  const params = new URLSearchParams();
  params.set('mode', filterState.mode);
  params.set('includeBreakdown', 'true');

  if (filterState.selectedActorSubtypes.length > 0) {
    params.set('actorSubtypes', filterState.selectedActorSubtypes.join(','));
  }
  if (filterState.selectedEventTypes.length > 0) {
    params.set('eventTypes', filterState.selectedEventTypes.join(','));
  }
  if (filterState.selectedRegulationTypes.length > 0) {
    params.set('regulationTypes', filterState.selectedRegulationTypes.join(','));
  }

  return `/api/coverage/matrix?${params.toString()}`;
}

export function useCoverageMatrix(filterState: FilterState) {
  const url = buildUrl(filterState);

  const { data, error, isLoading, isValidating } = useSWR<CoverageMatrixResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return { matrix: data, error, isLoading, isValidating };
}
