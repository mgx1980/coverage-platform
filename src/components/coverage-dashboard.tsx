'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModeSelector } from './mode-selector';
import { FilterBar } from './filter-bar';
import { Legend } from './legend';
import { CoverageMatrix } from './coverage-matrix';
import { useCoverageMatrix } from '@/hooks/use-coverage-matrix';
import type { FilterState } from '@/types/coverage';

const DEFAULT_FILTER_STATE: FilterState = {
  mode: 'total',
  selectedActorSubtypes: [],
  selectedEventTypes: [],
  selectedRegulationTypes: [],
};

export function CoverageDashboard() {
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const { matrix, error, isLoading, isValidating } = useCoverageMatrix(filterState);

  const handleModeChange = (mode: FilterState['mode']) => {
    setFilterState({
      mode,
      selectedActorSubtypes: [],
      selectedEventTypes: [],
      selectedRegulationTypes: [],
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Failed to load coverage data</p>
            <p className="text-sm text-gray-500 mt-1">
              Check that DATABASE_URL is configured in Vercel environment variables
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Coverage Matrix</CardTitle>
            {isValidating && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                Updating...
              </Badge>
            )}
            {matrix && (
              <span className="text-sm text-gray-500">
                {matrix.countries.length} countries &times; {matrix.industries.length} industries
              </span>
            )}
          </div>
          <ModeSelector mode={filterState.mode} onChange={handleModeChange} />
        </div>
        <FilterBar filterState={filterState} onChange={setFilterState} />
        <Legend />
      </CardHeader>
      <CardContent>
        <CoverageMatrix
          countries={matrix?.countries ?? []}
          industries={matrix?.industries ?? []}
          counts={matrix?.counts ?? []}
          levels={matrix?.levels ?? []}
          breakdown={matrix?.breakdown}
          loading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
