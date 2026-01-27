export type CoverageMode = 'actors' | 'events' | 'regulations' | 'total';

export type CoverageLevel = 'none' | 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh';

export type ActorSubtype = 'person' | 'company' | 'gov_body' | 'org';

export type EventType = 'event' | 'quote' | 'appointment' | 'conference' | 'post';

export type RegulationType =
  | 'legislative_acts'
  | 'regulatory_instruments'
  | 'policy_docs'
  | 'decisions_orders'
  | 'international_agreements'
  | 'other_docs'
  | 'public_consultations';

export interface Country {
  id: string;
  name: string;
  displayName: string;
}

export interface Industry {
  id: string;
  name: string;
}

export interface CoverageFilters {
  countries: Country[];
  industries: Industry[];
  actorSubtypes: ActorSubtype[];
  eventTypes: EventType[];
  regulationTypes: RegulationType[];
}

export interface CoverageThresholds {
  low: number;
  medium: number;
  high: number;
}

export interface CoverageBreakdown {
  actorCounts: number[];
  eventCounts: number[];
  regulationCounts: number[];
}

export interface CoverageMatrixResponse {
  countries: Country[];
  industries: Industry[];
  counts: number[];
  levels: CoverageLevel[];
  thresholds: CoverageThresholds;
  breakdown?: CoverageBreakdown;
}

export interface FilterState {
  mode: CoverageMode;
  selectedActorSubtypes: ActorSubtype[];
  selectedEventTypes: EventType[];
  selectedRegulationTypes: RegulationType[];
}

// Display constants for UI
export const ACTOR_SUBTYPES: { value: ActorSubtype; label: string }[] = [
  { value: 'person', label: 'Person' },
  { value: 'company', label: 'Company' },
  { value: 'gov_body', label: 'Government Body' },
  { value: 'org', label: 'Organization' },
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'event', label: 'Event' },
  { value: 'quote', label: 'Quote' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'conference', label: 'Conference' },
  { value: 'post', label: 'Post' },
];

export const REGULATION_TYPES: { value: RegulationType; label: string }[] = [
  { value: 'legislative_acts', label: 'Legislative Acts' },
  { value: 'regulatory_instruments', label: 'Regulatory Instruments' },
  { value: 'policy_docs', label: 'Policy Documents' },
  { value: 'decisions_orders', label: 'Decisions & Orders' },
  { value: 'international_agreements', label: 'International Agreements' },
  { value: 'other_docs', label: 'Other Documents' },
  { value: 'public_consultations', label: 'Public Consultations' },
];

export const COVERAGE_MODES: { value: CoverageMode; label: string }[] = [
  { value: 'total', label: 'Total' },
  { value: 'actors', label: 'Actors' },
  { value: 'events', label: 'Events' },
  { value: 'regulations', label: 'Regulations' },
];

// Valid values for Zod validation
export const VALID_MODES: CoverageMode[] = ['actors', 'events', 'regulations', 'total'];
export const VALID_ACTOR_SUBTYPES: ActorSubtype[] = ['person', 'company', 'gov_body', 'org'];
export const VALID_EVENT_TYPES: EventType[] = ['event', 'quote', 'appointment', 'conference', 'post'];
export const VALID_REGULATION_TYPES: RegulationType[] = [
  'legislative_acts', 'regulatory_instruments', 'policy_docs',
  'decisions_orders', 'international_agreements', 'other_docs', 'public_consultations',
];
