import type { CoverageLevel } from '@/types/coverage';

export const LEVEL_COLORS: Record<CoverageLevel, string> = {
  none: '#f3f4f6',
  veryLow: '#fee2e2',
  low: '#fecaca',
  medium: '#fcd34d',
  high: '#86efac',
  veryHigh: '#22c55e',
};

export const LEVEL_LABELS: Record<CoverageLevel, string> = {
  none: 'None',
  veryLow: 'Very Low',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  veryHigh: 'Very High',
};

export function getColorFromLevel(level: CoverageLevel): string {
  return LEVEL_COLORS[level] ?? LEVEL_COLORS.none;
}
