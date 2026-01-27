import { query } from '@/lib/db';
import { cacheGet, cacheSet, generateCacheKey } from '@/lib/cache';
import { buildCoverageQuery } from './queries';
import {
  getCountryWeight,
  calculateExpectedCoverage,
  getCountryDisplayName,
  normalizeCoverage,
} from './country-weights';
import type {
  CoverageMode,
  ActorSubtype,
  EventType,
  RegulationType,
  CoverageMatrixResponse,
  CoverageThresholds,
} from '@/types/coverage';

interface MatrixParams {
  mode: CoverageMode;
  actorSubtypes?: ActorSubtype[];
  eventTypes?: EventType[];
  regulationTypes?: RegulationType[];
  includeBreakdown?: boolean;
}

interface CountryRow {
  id: string;
  name: string;
}

interface IndustryRow {
  id: string;
  name: string;
}

interface HierarchyRow {
  industry_id: string;
  subsector_name: string;
  sector_name: string;
}

interface MatrixRow {
  country_id: string;
  industry_id: string;
  count: string;
  actor_sum?: string;
  event_sum?: string;
  regulation_sum?: string;
}

function computeThresholds(counts: number[]): CoverageThresholds {
  const nonZeroCounts = counts.filter((c) => c > 0).sort((a, b) => a - b);

  if (nonZeroCounts.length === 0) {
    return { low: 10, medium: 50, high: 100 };
  }

  const p50 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.5)] || 1;
  const p75 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.75)] || p50;
  const p90 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.9)] || p75;

  return { low: p50, medium: p75, high: p90 };
}

async function executeCoverageQuery(params: MatrixParams): Promise<CoverageMatrixResponse> {
  const { mode, actorSubtypes, eventTypes, regulationTypes, includeBreakdown } = params;

  const [countriesResult, industriesResult, hierarchyResult] = await Promise.all([
    query<CountryRow>('SELECT id, name FROM published_countries ORDER BY name'),
    query<IndustryRow>(`SELECT id, name FROM published_briefs WHERE type = 'industry' ORDER BY name`),
    query<HierarchyRow>(`
      SELECT
        ind.id AS industry_id,
        COALESCE(subsec.name, '') AS subsector_name,
        COALESCE(sec.name, '') AS sector_name
      FROM published_briefs ind
      LEFT JOIN brief_tree bt1 ON bt1.child_id = ind.id
      LEFT JOIN published_briefs subsec ON subsec.id = bt1.parent_id AND subsec.type = 'sub-sector'
      LEFT JOIN brief_tree bt2 ON bt2.child_id = subsec.id
      LEFT JOIN published_briefs sec ON sec.id = bt2.parent_id AND sec.type = 'sector'
      WHERE ind.type = 'industry'
    `),
  ]);

  // Sort countries by expected coverage (economic significance) descending
  const countries = countriesResult.rows
    .sort((a, b) => {
      const weightA = getCountryWeight(a.name) || { gdp: 0.001, population: 0.01 };
      const weightB = getCountryWeight(b.name) || { gdp: 0.001, population: 0.01 };
      const expectedA = calculateExpectedCoverage(weightA.gdp, weightA.population);
      const expectedB = calculateExpectedCoverage(weightB.gdp, weightB.population);
      return expectedB - expectedA;
    })
    .map((c) => ({ ...c, displayName: getCountryDisplayName(c.name) }));

  // Sort industries by hierarchy
  const hierarchyMap = new Map<string, { sectorName: string; subsectorName: string }>();
  for (const row of hierarchyResult.rows) {
    hierarchyMap.set(row.industry_id, {
      sectorName: row.sector_name,
      subsectorName: row.subsector_name,
    });
  }

  const industries = industriesResult.rows.sort((a, b) => {
    const hierA = hierarchyMap.get(a.id) || { sectorName: '', subsectorName: '' };
    const hierB = hierarchyMap.get(b.id) || { sectorName: '', subsectorName: '' };

    const sectorCompare = hierA.sectorName.localeCompare(hierB.sectorName);
    if (sectorCompare !== 0) return sectorCompare;

    const subsectorCompare = hierA.subsectorName.localeCompare(hierB.subsectorName);
    if (subsectorCompare !== 0) return subsectorCompare;

    return a.name.localeCompare(b.name);
  });

  // Build and execute query
  const sql = buildCoverageQuery({ mode, actorSubtypes, eventTypes, regulationTypes, includeBreakdown });
  const result = await query<MatrixRow>(sql);

  // Build lookup maps
  const countryOrder = new Map(countries.map((c, i) => [c.id, i]));
  const industryOrder = new Map(industries.map((ind, i) => [ind.id, i]));

  // Initialize arrays
  const totalCells = countries.length * industries.length;
  const counts = new Array<number>(totalCells).fill(0);
  const actorCounts = includeBreakdown ? new Array<number>(totalCells).fill(0) : null;
  const eventCounts = includeBreakdown ? new Array<number>(totalCells).fill(0) : null;
  const regulationCounts = includeBreakdown ? new Array<number>(totalCells).fill(0) : null;

  for (const row of result.rows) {
    const countryIdx = countryOrder.get(row.country_id);
    const industryIdx = industryOrder.get(row.industry_id);

    if (countryIdx !== undefined && industryIdx !== undefined) {
      const idx = countryIdx * industries.length + industryIdx;
      counts[idx] = parseInt(row.count, 10);

      if (includeBreakdown) {
        actorCounts![idx] = parseInt(row.actor_sum || '0', 10);
        eventCounts![idx] = parseInt(row.event_sum || '0', 10);
        regulationCounts![idx] = parseInt(row.regulation_sum || '0', 10);
      }
    }
  }

  const thresholds = computeThresholds(counts);
  const { levels } = normalizeCoverage(countries, counts, industries.length);

  const response: CoverageMatrixResponse = {
    countries,
    industries,
    counts,
    thresholds,
    levels,
  };

  if (includeBreakdown && actorCounts && eventCounts && regulationCounts) {
    response.breakdown = { actorCounts, eventCounts, regulationCounts };
  }

  return response;
}

export async function getCoverageMatrix(params: MatrixParams): Promise<CoverageMatrixResponse> {
  const cacheKey = generateCacheKey({
    prefix: 'matrix',
    mode: params.mode,
    actors: params.actorSubtypes || [],
    events: params.eventTypes || [],
    regs: params.regulationTypes || [],
    breakdown: params.includeBreakdown || false,
  });

  const cached = cacheGet<CoverageMatrixResponse>(cacheKey);
  if (cached) return cached;

  const response = await executeCoverageQuery(params);
  cacheSet(cacheKey, response);
  return response;
}
