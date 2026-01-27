'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { getColorFromLevel } from '@/lib/colors';
import type { Country, Industry, CoverageLevel, CoverageBreakdown } from '@/types/coverage';

interface CoverageMatrixProps {
  countries: Country[];
  industries: Industry[];
  counts: number[];
  levels: CoverageLevel[];
  breakdown?: CoverageBreakdown;
  loading: boolean;
}

export function CoverageMatrix({
  countries,
  industries,
  counts,
  levels,
  breakdown,
  loading,
}: CoverageMatrixProps) {
  const getCellData = useMemo(() => {
    const industryCount = industries.length;
    return (countryIndex: number, industryIndex: number) => {
      const idx = countryIndex * industryCount + industryIndex;
      return {
        count: counts[idx] ?? 0,
        level: (levels[idx] ?? 'none') as CoverageLevel,
        actors: breakdown?.actorCounts[idx] ?? 0,
        events: breakdown?.eventCounts[idx] ?? 0,
        regulations: breakdown?.regulationCounts[idx] ?? 0,
      };
    };
  }, [counts, levels, industries.length, breakdown]);

  if (loading && countries.length === 0) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 15 }).map((_, row) => (
          <div key={row} className="flex gap-px items-center">
            <Skeleton className="h-6 w-32 flex-shrink-0" />
            {Array.from({ length: 20 }).map((_, col) => (
              <Skeleton key={col} className="h-6 w-6 flex-shrink-0" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (countries.length === 0 || industries.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No coverage data available
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="overflow-auto h-[calc(100vh-240px)]">
        <table className="border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="sticky left-0 bg-white z-20 w-40" />
              {industries.map((industry) => (
                <th key={industry.id} className="h-32 w-7 relative">
                  <div
                    className="text-[10px] text-gray-500 font-medium whitespace-nowrap absolute bottom-0 left-1/2 origin-bottom-left -rotate-45"
                    title={industry.name}
                  >
                    {industry.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {countries.map((country, countryIndex) => (
              <tr key={country.id}>
                <td
                  className="sticky left-0 bg-white z-10 pr-3 text-sm text-gray-700 whitespace-nowrap font-medium"
                  title={country.name}
                >
                  {country.displayName}
                </td>
                {industries.map((industry, industryIndex) => {
                  const cell = getCellData(countryIndex, industryIndex);
                  const color = getColorFromLevel(cell.level);
                  return (
                    <td key={industry.id} className="p-px">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="w-6 h-6 rounded-sm cursor-default transition-opacity hover:opacity-80"
                            style={{ backgroundColor: color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div className="font-semibold">
                            {country.name} / {industry.name}
                          </div>
                          <div>Total: {cell.count}</div>
                          {breakdown && (
                            <div className="text-gray-400 mt-0.5">
                              Actors: {cell.actors} | Events: {cell.events} | Regs: {cell.regulations}
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}
