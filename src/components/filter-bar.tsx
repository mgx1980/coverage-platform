'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  ACTOR_SUBTYPES,
  EVENT_TYPES,
  REGULATION_TYPES,
} from '@/types/coverage';
import type {
  CoverageMode,
  ActorSubtype,
  EventType,
  RegulationType,
  FilterState,
} from '@/types/coverage';

interface FilterBarProps {
  filterState: FilterState;
  onChange: (state: FilterState) => void;
}

function FilterGroup<T extends string>({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T, checked: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <label
            key={item.value}
            className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer"
          >
            <Checkbox
              checked={selected.length === 0 || selected.includes(item.value)}
              onCheckedChange={(checked) => onToggle(item.value, !!checked)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterBar({ filterState, onChange }: FilterBarProps) {
  const { mode } = filterState;

  const toggleActorSubtype = (value: ActorSubtype, checked: boolean) => {
    const current = filterState.selectedActorSubtypes;
    const next = checked
      ? current.length === 0
        ? [value]
        : [...current, value]
      : current.filter((v) => v !== value);
    onChange({ ...filterState, selectedActorSubtypes: next });
  };

  const toggleEventType = (value: EventType, checked: boolean) => {
    const current = filterState.selectedEventTypes;
    const next = checked
      ? current.length === 0
        ? [value]
        : [...current, value]
      : current.filter((v) => v !== value);
    onChange({ ...filterState, selectedEventTypes: next });
  };

  const toggleRegulationType = (value: RegulationType, checked: boolean) => {
    const current = filterState.selectedRegulationTypes;
    const next = checked
      ? current.length === 0
        ? [value]
        : [...current, value]
      : current.filter((v) => v !== value);
    onChange({ ...filterState, selectedRegulationTypes: next });
  };

  return (
    <div className="flex flex-wrap gap-6">
      {(mode === 'actors' || mode === 'total') && (
        <FilterGroup
          label="Actor Types"
          items={ACTOR_SUBTYPES}
          selected={filterState.selectedActorSubtypes}
          onToggle={toggleActorSubtype}
        />
      )}
      {(mode === 'events' || mode === 'total') && (
        <FilterGroup
          label="Event Types"
          items={EVENT_TYPES}
          selected={filterState.selectedEventTypes}
          onToggle={toggleEventType}
        />
      )}
      {(mode === 'regulations' || mode === 'total') && (
        <FilterGroup
          label="Regulation Types"
          items={REGULATION_TYPES}
          selected={filterState.selectedRegulationTypes}
          onToggle={toggleRegulationType}
        />
      )}
    </div>
  );
}
