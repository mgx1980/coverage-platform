import { query } from '@/lib/db';
import { getCountryDisplayName } from './country-weights';
import type { ActorSubtype, EventType, RegulationType, CoverageFilters } from '@/types/coverage';

const ACTOR_SUBTYPES: ActorSubtype[] = ['person', 'company', 'gov_body', 'org'];
const EVENT_TYPES: EventType[] = ['event', 'quote', 'appointment', 'conference', 'post'];
const REGULATION_TYPES: RegulationType[] = [
  'legislative_acts', 'regulatory_instruments', 'policy_docs',
  'decisions_orders', 'international_agreements', 'other_docs', 'public_consultations',
];

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

export async function getCoverageFilters(): Promise<CoverageFilters> {
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

  const countries = countriesResult.rows.map((c) => ({
    ...c,
    displayName: getCountryDisplayName(c.name),
  }));

  return {
    countries,
    industries,
    actorSubtypes: ACTOR_SUBTYPES,
    eventTypes: EVENT_TYPES,
    regulationTypes: REGULATION_TYPES,
  };
}
