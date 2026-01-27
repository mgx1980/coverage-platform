'use client';

import { LEVEL_COLORS, LEVEL_LABELS } from '@/lib/colors';
import type { CoverageLevel } from '@/types/coverage';

const LEVELS: CoverageLevel[] = ['none', 'veryLow', 'low', 'medium', 'high', 'veryHigh'];

export function Legend() {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-600">
      <span className="font-medium">Coverage:</span>
      {LEVELS.map((level) => (
        <div key={level} className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-sm border border-gray-200"
            style={{ backgroundColor: LEVEL_COLORS[level] }}
          />
          <span>{LEVEL_LABELS[level]}</span>
        </div>
      ))}
    </div>
  );
}
