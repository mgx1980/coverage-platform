import { NextRequest, NextResponse } from 'next/server';
import { getCoverageMatrix } from '@/lib/coverage/matrix';
import {
  VALID_MODES,
  VALID_ACTOR_SUBTYPES,
  VALID_EVENT_TYPES,
  VALID_REGULATION_TYPES,
} from '@/types/coverage';
import type { CoverageMode, ActorSubtype, EventType, RegulationType } from '@/types/coverage';

function parseArrayParam<T extends string>(value: string | null, valid: readonly T[]): T[] | undefined {
  if (!value) return undefined;
  const items = value.split(',').filter((v): v is T => (valid as readonly string[]).includes(v));
  return items.length > 0 ? items : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Validate mode
    const modeParam = searchParams.get('mode') || 'total';
    if (!(VALID_MODES as readonly string[]).includes(modeParam)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` },
        { status: 400 }
      );
    }
    const mode = modeParam as CoverageMode;

    // Parse optional filter arrays
    const actorSubtypes = parseArrayParam<ActorSubtype>(
      searchParams.get('actorSubtypes'),
      VALID_ACTOR_SUBTYPES
    );
    const eventTypes = parseArrayParam<EventType>(
      searchParams.get('eventTypes'),
      VALID_EVENT_TYPES
    );
    const regulationTypes = parseArrayParam<RegulationType>(
      searchParams.get('regulationTypes'),
      VALID_REGULATION_TYPES
    );
    const includeBreakdown = searchParams.get('includeBreakdown') === 'true';

    const data = await getCoverageMatrix({
      mode,
      actorSubtypes,
      eventTypes,
      regulationTypes,
      includeBreakdown,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coverage matrix:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coverage matrix' },
      { status: 500 }
    );
  }
}
