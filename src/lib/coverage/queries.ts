import type { ActorSubtype, EventType, RegulationType, CoverageMode } from '@/types/coverage';

const ACTOR_SUBTYPES: ActorSubtype[] = ['person', 'company', 'gov_body', 'org'];
const EVENT_TYPES: EventType[] = ['event', 'quote', 'appointment', 'conference', 'post'];
const REGULATION_TYPES: RegulationType[] = [
  'legislative_acts', 'regulatory_instruments', 'policy_docs',
  'decisions_orders', 'international_agreements', 'other_docs', 'public_consultations',
];

const ACTOR_SUBTYPE_MAP: Record<ActorSubtype, string> = {
  person: 'Person',
  company: 'Company',
  gov_body: 'GovernmentBody',
  org: 'Organization',
};

const REGULATION_TYPE_MAP: Record<RegulationType, string> = {
  legislative_acts: 'Legislative Acts',
  regulatory_instruments: 'Regulatory Instruments',
  policy_docs: 'Policy Documents and Advisory Opinions',
  decisions_orders: 'Decisions and Orders',
  international_agreements: 'International and Interinstitutional Agreements',
  other_docs: 'Other Documents',
  public_consultations: 'Public Consultations',
};

function escapeValue(v: string): string {
  // Simple allowlist: only permit known constant values
  return v.replace(/'/g, "''");
}

export interface BuildQueryParams {
  mode: CoverageMode;
  actorSubtypes?: ActorSubtype[];
  eventTypes?: EventType[];
  regulationTypes?: RegulationType[];
  includeBreakdown?: boolean;
}

export function buildCoverageQuery({
  mode,
  actorSubtypes,
  eventTypes,
  regulationTypes,
  includeBreakdown,
}: BuildQueryParams): string {
  const selectedActors = actorSubtypes?.length ? actorSubtypes : ACTOR_SUBTYPES;
  const selectedEvents = eventTypes?.length ? eventTypes : EVENT_TYPES;
  const selectedRegs = regulationTypes?.length ? regulationTypes : REGULATION_TYPES;

  const actorSubtypeValues = selectedActors
    .map((s) => ACTOR_SUBTYPE_MAP[s])
    .filter(Boolean)
    .map((v) => `'${escapeValue(v)}'`)
    .join(', ');

  const eventTypeConditions = selectedEvents
    .map((t) => `content_type = '${escapeValue(t)}'`)
    .join(' OR ');

  const regTypeValues = selectedRegs
    .map((t) => REGULATION_TYPE_MAP[t])
    .filter(Boolean)
    .map((v) => `'${escapeValue(v)}'`)
    .join(', ');

  const computeActors = mode === 'actors' || mode === 'total';
  const computeEvents = mode === 'events' || mode === 'total';
  const computeRegs = mode === 'regulations' || mode === 'total';

  const query = `
    WITH
    grid AS (
      SELECT c.id AS country_id, i.id AS industry_id
      FROM published_countries c
      CROSS JOIN published_briefs i
      WHERE i.type = 'industry'
    )

    ${computeEvents || includeBreakdown ? `,
    content_links AS (
      SELECT DISTINCT
        e.id AS content_id,
        'event' AS content_type,
        ce.published_country_id AS country_id,
        be.published_brief_id AS industry_id
      FROM "publishedEvents" e
      JOIN pub_countries_events ce ON ce.published_event_id = e.id
      JOIN pub_briefs_events be ON be.published_event_id = e.id

      UNION ALL

      SELECT DISTINCT
        q.id AS content_id,
        'quote' AS content_type,
        qc.country_id AS country_id,
        qi.industry_id AS industry_id
      FROM quotes q
      JOIN quote_country qc ON qc.quote_id = q.id
      JOIN quote_industry qi ON qi.quote_id = q.id

      UNION ALL

      SELECT DISTINCT
        a.id AS content_id,
        'appointment' AS content_type,
        pce.published_country_id AS country_id,
        ai.industry_id AS industry_id
      FROM appointment a
      JOIN appointment_industry ai ON ai.appointment_id = a.id
      LEFT JOIN "publishedEvents" pe ON pe.id = a.published_event_id
      LEFT JOIN pub_countries_events pce ON pce.published_event_id = pe.id
      WHERE pce.published_country_id IS NOT NULL

      UNION ALL

      SELECT DISTINCT
        c.id AS content_id,
        'conference' AS content_type,
        c.published_country_id AS country_id,
        ci.industry_id AS industry_id
      FROM conference c
      JOIN conference_industry ci ON ci.conference_id = c.id
      WHERE c.published_country_id IS NOT NULL

      UNION ALL

      SELECT DISTINCT
        p.id AS content_id,
        'post' AS content_type,
        p.published_country_id AS country_id,
        pi.industry_id AS industry_id
      FROM post p
      JOIN post_industry pi ON pi.post_id = p.id
      WHERE p.published_country_id IS NOT NULL
    ),

    content_agg AS (
      SELECT
        country_id,
        industry_id,
        COUNT(DISTINCT content_id) AS event_count
      FROM content_links
      WHERE ${eventTypeConditions || '1=1'}
      GROUP BY country_id, industry_id
    )` : ''}

    ${computeRegs || includeBreakdown ? `,
    reg_links AS (
      SELECT DISTINCT
        r.id AS reg_id,
        r.type AS regulation_type,
        r.published_country_id AS country_id,
        rb.published_brief_id AS industry_id
      FROM published_regulations r
      JOIN pub_briefs_regulations rb ON rb.published_regulation_id = r.id
      WHERE r.published_country_id IS NOT NULL
        AND r.type IN (${regTypeValues || "''"})
    ),

    reg_agg AS (
      SELECT
        country_id,
        industry_id,
        COUNT(DISTINCT reg_id) AS reg_count
      FROM reg_links
      GROUP BY country_id, industry_id
    )` : ''}

    ${computeActors || includeBreakdown ? `,
    actor_links AS (
      SELECT DISTINCT
        pe.id AS actor_id,
        pe.entity ->> 'subType' AS actor_subtype,
        ce.published_country_id AS country_id,
        be.published_brief_id AS industry_id
      FROM "publishedEvents" e
      JOIN pub_countries_events ce ON ce.published_event_id = e.id
      JOIN pub_briefs_events be ON be.published_event_id = e.id
      JOIN "pubEventsEntities" pee ON pee."publishedEventId" = e.id
      JOIN "publishedEntities" pe ON pe.id = pee."publishedEntityId"
      WHERE pe.entity ->> 'subType' IN (${actorSubtypeValues || "''"})
    ),

    actor_agg AS (
      SELECT
        country_id,
        industry_id,
        COUNT(DISTINCT actor_id) AS actor_count
      FROM actor_links
      GROUP BY country_id, industry_id
    )` : ''}

    SELECT
      g.country_id,
      g.industry_id,
      ${mode === 'actors' ? 'COALESCE(a.actor_count, 0)' :
        mode === 'events' ? 'COALESCE(c.event_count, 0)' :
        mode === 'regulations' ? 'COALESCE(r.reg_count, 0)' :
        'COALESCE(a.actor_count, 0) + COALESCE(c.event_count, 0) + COALESCE(r.reg_count, 0)'
      } AS count
      ${includeBreakdown ? `,
      COALESCE(a.actor_count, 0) AS actor_sum,
      COALESCE(c.event_count, 0) AS event_sum,
      COALESCE(r.reg_count, 0) AS regulation_sum` : ''}
    FROM grid g
    ${computeActors || includeBreakdown ? 'LEFT JOIN actor_agg a ON a.country_id = g.country_id AND a.industry_id = g.industry_id' : ''}
    ${computeEvents || includeBreakdown ? 'LEFT JOIN content_agg c ON c.country_id = g.country_id AND c.industry_id = g.industry_id' : ''}
    ${computeRegs || includeBreakdown ? 'LEFT JOIN reg_agg r ON r.country_id = g.country_id AND r.industry_id = g.industry_id' : ''}
    ORDER BY g.country_id, g.industry_id
  `;

  return query;
}
