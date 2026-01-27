'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COVERAGE_MODES } from '@/types/coverage';
import type { CoverageMode } from '@/types/coverage';

interface ModeSelectorProps {
  mode: CoverageMode;
  onChange: (mode: CoverageMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onChange(v as CoverageMode)}>
      <TabsList>
        {COVERAGE_MODES.map((m) => (
          <TabsTrigger key={m.value} value={m.value}>
            {m.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
