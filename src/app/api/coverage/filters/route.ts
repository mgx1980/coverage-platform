import { NextResponse } from 'next/server';
import { getCoverageFilters } from '@/lib/coverage/filters';
import { cacheGet, cacheSet } from '@/lib/cache';
import type { CoverageFilters } from '@/types/coverage';

const CACHE_KEY = 'coverage_filters';

export async function GET() {
  try {
    const cached = cacheGet<CoverageFilters>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }

    const filters = await getCoverageFilters();
    cacheSet(CACHE_KEY, filters);
    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching coverage filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coverage filters' },
      { status: 500 }
    );
  }
}
