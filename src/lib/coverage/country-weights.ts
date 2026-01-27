/**
 * Country economic weights for coverage normalization.
 * GDP in trillions USD (2024 estimates)
 * Population in millions (2024 estimates)
 *
 * Formula: expected_coverage = (GDP ^ 0.75) * (Population ^ 0.25)
 * Normalized score = actual_count / expected_coverage
 */

import type { CoverageLevel } from '@/types/coverage';

interface CountryWeight {
  gdp: number;
  population: number;
}

export const COUNTRY_WEIGHTS: Record<string, CountryWeight> = {
  // Major economies
  'United States': { gdp: 27.4, population: 335 },
  'China': { gdp: 17.8, population: 1425 },
  'Japan': { gdp: 4.2, population: 124 },
  'Germany': { gdp: 4.5, population: 84 },
  'India': { gdp: 3.9, population: 1428 },
  'United Kingdom': { gdp: 3.3, population: 67 },
  'France': { gdp: 3.0, population: 68 },
  'Italy': { gdp: 2.2, population: 59 },
  'Brazil': { gdp: 2.2, population: 216 },
  'Canada': { gdp: 2.1, population: 40 },
  'Russia': { gdp: 1.9, population: 144 },
  'Australia': { gdp: 1.7, population: 26 },
  'South Korea': { gdp: 1.7, population: 52 },
  'Mexico': { gdp: 1.5, population: 130 },
  'Spain': { gdp: 1.6, population: 47 },
  'Indonesia': { gdp: 1.4, population: 277 },
  'Netherlands': { gdp: 1.1, population: 18 },
  'Saudi Arabia': { gdp: 1.1, population: 36 },
  'Turkey': { gdp: 1.0, population: 85 },
  'Switzerland': { gdp: 0.91, population: 9 },
  'Poland': { gdp: 0.81, population: 38 },
  'Taiwan': { gdp: 0.79, population: 24 },
  'Belgium': { gdp: 0.63, population: 12 },
  'Sweden': { gdp: 0.59, population: 10 },
  'Ireland': { gdp: 0.55, population: 5 },
  'Argentina': { gdp: 0.64, population: 46 },
  'Austria': { gdp: 0.52, population: 9 },
  'Norway': { gdp: 0.49, population: 5 },
  'Israel': { gdp: 0.52, population: 9 },
  'United Arab Emirates': { gdp: 0.51, population: 10 },
  'Thailand': { gdp: 0.51, population: 70 },
  'Singapore': { gdp: 0.50, population: 6 },
  'Malaysia': { gdp: 0.43, population: 34 },
  'South Africa': { gdp: 0.40, population: 60 },
  'Denmark': { gdp: 0.41, population: 6 },
  'Philippines': { gdp: 0.44, population: 117 },
  'Bangladesh': { gdp: 0.42, population: 173 },
  'Hong Kong': { gdp: 0.38, population: 7 },
  'Colombia': { gdp: 0.36, population: 52 },
  'Egypt': { gdp: 0.39, population: 111 },
  'Chile': { gdp: 0.34, population: 20 },
  'Finland': { gdp: 0.31, population: 6 },
  'Vietnam': { gdp: 0.43, population: 100 },
  'Czech Republic': { gdp: 0.33, population: 11 },
  'Romania': { gdp: 0.35, population: 19 },
  'Portugal': { gdp: 0.29, population: 10 },
  'New Zealand': { gdp: 0.25, population: 5 },
  'Peru': { gdp: 0.27, population: 34 },
  'Iraq': { gdp: 0.27, population: 44 },
  'Greece': { gdp: 0.24, population: 10 },
  'Qatar': { gdp: 0.24, population: 3 },
  'Kazakhstan': { gdp: 0.26, population: 20 },
  'Algeria': { gdp: 0.24, population: 45 },
  'Hungary': { gdp: 0.21, population: 10 },
  'Kuwait': { gdp: 0.16, population: 4 },
  'Ukraine': { gdp: 0.18, population: 37 },
  'Morocco': { gdp: 0.15, population: 37 },
  'Puerto Rico': { gdp: 0.12, population: 3 },
  'Ecuador': { gdp: 0.12, population: 18 },
  'Slovakia': { gdp: 0.13, population: 5 },
  'Kenya': { gdp: 0.11, population: 54 },
  'Angola': { gdp: 0.12, population: 36 },
  'Oman': { gdp: 0.11, population: 5 },
  'Dominican Republic': { gdp: 0.12, population: 11 },
  'Guatemala': { gdp: 0.10, population: 18 },
  'Luxembourg': { gdp: 0.09, population: 0.67 },
  'Bulgaria': { gdp: 0.10, population: 7 },
  'Ethiopia': { gdp: 0.16, population: 126 },
  'Uzbekistan': { gdp: 0.09, population: 36 },
  'Panama': { gdp: 0.08, population: 4 },
  'Costa Rica': { gdp: 0.08, population: 5 },
  'Croatia': { gdp: 0.08, population: 4 },
  'Tanzania': { gdp: 0.08, population: 67 },
  'Ghana': { gdp: 0.08, population: 34 },
  'Uruguay': { gdp: 0.07, population: 4 },
  'Slovenia': { gdp: 0.07, population: 2 },
  'Lithuania': { gdp: 0.08, population: 3 },
  'Turkmenistan': { gdp: 0.08, population: 6 },
  'Azerbaijan': { gdp: 0.08, population: 10 },
  'Serbia': { gdp: 0.07, population: 7 },
  'Ivory Coast': { gdp: 0.08, population: 28 },
  "Cote D'Ivoire": { gdp: 0.08, population: 28 },
  'Democratic Republic Of Congo': { gdp: 0.07, population: 102 },
  'Myanmar': { gdp: 0.06, population: 55 },
  'Jordan': { gdp: 0.05, population: 11 },
  'Tunisia': { gdp: 0.05, population: 12 },
  'Bolivia': { gdp: 0.05, population: 12 },
  'Cameroon': { gdp: 0.05, population: 28 },
  'Bahrain': { gdp: 0.05, population: 2 },
  'Paraguay': { gdp: 0.04, population: 7 },
  'Latvia': { gdp: 0.04, population: 2 },
  'Libya': { gdp: 0.05, population: 7 },
  'El Salvador': { gdp: 0.03, population: 6 },
  'Estonia': { gdp: 0.04, population: 1 },
  'Honduras': { gdp: 0.03, population: 10 },
  'Nepal': { gdp: 0.04, population: 30 },
  'Cyprus': { gdp: 0.03, population: 1 },
  'Papua New Guinea': { gdp: 0.03, population: 10 },
  'Cambodia': { gdp: 0.03, population: 17 },
  'Zimbabwe': { gdp: 0.03, population: 16 },
  'Senegal': { gdp: 0.03, population: 18 },
  'Uganda': { gdp: 0.05, population: 48 },
  'Bosnia And Herzegovina': { gdp: 0.03, population: 3 },
  'Iceland': { gdp: 0.03, population: 0.4 },
  'Georgia': { gdp: 0.03, population: 4 },
  'Afghanistan': { gdp: 0.02, population: 42 },
  'Albania': { gdp: 0.02, population: 3 },
  'Jamaica': { gdp: 0.02, population: 3 },
  'Zambia': { gdp: 0.03, population: 20 },
  'Botswana': { gdp: 0.02, population: 2 },
  'Trinidad And Tobago': { gdp: 0.03, population: 1 },
  'Mali': { gdp: 0.02, population: 23 },
  'Gabon': { gdp: 0.02, population: 2 },
  'Mozambique': { gdp: 0.02, population: 33 },
  'Benin': { gdp: 0.02, population: 14 },
  'Burkina Faso': { gdp: 0.02, population: 23 },
  'Madagascar': { gdp: 0.02, population: 30 },
  'Mongolia': { gdp: 0.02, population: 3 },
  'Nicaragua': { gdp: 0.02, population: 7 },
  'Armenia': { gdp: 0.02, population: 3 },
  'Malta': { gdp: 0.02, population: 0.5 },
  'North Macedonia': { gdp: 0.02, population: 2 },
  'Macedonia': { gdp: 0.02, population: 2 },
  'Brunei Darussalam': { gdp: 0.02, population: 0.5 },
  'Bahamas': { gdp: 0.01, population: 0.4 },
  'Guinea': { gdp: 0.02, population: 14 },
  'Rwanda': { gdp: 0.01, population: 14 },
  'Chad': { gdp: 0.01, population: 18 },
  'Laos': { gdp: 0.02, population: 8 },
  'Namibia': { gdp: 0.01, population: 3 },
  'Tajikistan': { gdp: 0.01, population: 10 },
  'Malawi': { gdp: 0.01, population: 20 },
  'Mauritius': { gdp: 0.02, population: 1 },
  'Moldova': { gdp: 0.02, population: 3 },
  'Kosovo': { gdp: 0.01, population: 2 },
  'Niger': { gdp: 0.02, population: 27 },
  'Kyrgyzstan': { gdp: 0.01, population: 7 },
  'Maldives': { gdp: 0.01, population: 0.5 },
  'Haiti': { gdp: 0.02, population: 12 },
  'Equatorial Guinea': { gdp: 0.01, population: 2 },
  'Montenegro': { gdp: 0.01, population: 0.6 },
  'Barbados': { gdp: 0.01, population: 0.3 },
  'Fiji': { gdp: 0.01, population: 0.9 },
  'Eswatini': { gdp: 0.01, population: 1 },
  'Mauritania': { gdp: 0.01, population: 5 },
  'Guyana': { gdp: 0.02, population: 0.8 },
  'Togo': { gdp: 0.01, population: 9 },
  'Sierra Leone': { gdp: 0.01, population: 9 },
  'Suriname': { gdp: 0.004, population: 0.6 },
  'South Sudan': { gdp: 0.01, population: 11 },
  'Monaco': { gdp: 0.008, population: 0.04 },
  'Bhutan': { gdp: 0.003, population: 0.8 },
  'Liechtenstein': { gdp: 0.007, population: 0.04 },
  'Central African Republic': { gdp: 0.003, population: 5 },
  'Lesotho': { gdp: 0.003, population: 2 },
  'Liberia': { gdp: 0.004, population: 5 },
  'Cabo Verde': { gdp: 0.002, population: 0.6 },
  'Belize': { gdp: 0.003, population: 0.4 },
  'Djibouti': { gdp: 0.004, population: 1 },
  'Timor Leste': { gdp: 0.003, population: 1 },
  'Andorra': { gdp: 0.004, population: 0.08 },
  'Saint Lucia': { gdp: 0.002, population: 0.2 },
  'Antigua And Barbuda': { gdp: 0.002, population: 0.1 },
  'Seychelles': { gdp: 0.002, population: 0.1 },
  'Solomon Islands': { gdp: 0.002, population: 0.7 },
  'Guinea Bissau': { gdp: 0.002, population: 2 },
  'Grenada': { gdp: 0.001, population: 0.1 },
  'Saint Kitts And Nevis': { gdp: 0.001, population: 0.05 },
  'Gambia': { gdp: 0.002, population: 3 },
  'Vanuatu': { gdp: 0.001, population: 0.3 },
  'Samoa': { gdp: 0.001, population: 0.2 },
  'Saint Vincent And The Grenadines': { gdp: 0.001, population: 0.1 },
  'Comoros': { gdp: 0.001, population: 0.9 },
  'Dominica': { gdp: 0.001, population: 0.07 },
  'Tonga': { gdp: 0.0005, population: 0.1 },
  'Sao Tome And Principe': { gdp: 0.0006, population: 0.2 },
  'Micronesia': { gdp: 0.0004, population: 0.1 },
  'Palau': { gdp: 0.0003, population: 0.02 },
  'Marshall Islands': { gdp: 0.0003, population: 0.04 },
  'Kiribati': { gdp: 0.0003, population: 0.1 },
  'Nauru': { gdp: 0.0002, population: 0.01 },
  'Tuvalu': { gdp: 0.0001, population: 0.01 },
  'San Marino': { gdp: 0.002, population: 0.03 },
  'Vatican': { gdp: 0.0001, population: 0.0008 },

  // Additional countries
  'Nigeria': { gdp: 0.47, population: 223 },
  'Pakistan': { gdp: 0.34, population: 235 },
  'Iran': { gdp: 0.39, population: 89 },
  'Venezuela': { gdp: 0.10, population: 29 },
  'Sri Lanka': { gdp: 0.08, population: 22 },
  'Lebanon': { gdp: 0.02, population: 5 },
  'Syria': { gdp: 0.01, population: 22 },
  'Yemen': { gdp: 0.02, population: 34 },
  'Cuba': { gdp: 0.11, population: 11 },
  'North Korea': { gdp: 0.02, population: 26 },
  'Sudan': { gdp: 0.03, population: 48 },
  'Somalia': { gdp: 0.01, population: 18 },
  'Eritrea': { gdp: 0.003, population: 4 },
  'Burundi': { gdp: 0.003, population: 13 },
  'Republic of the Congo': { gdp: 0.01, population: 6 },
  'Curacao': { gdp: 0.003, population: 0.15 },
  'Bermuda': { gdp: 0.007, population: 0.06 },
  'Cayman Islands': { gdp: 0.006, population: 0.07 },
  'Palestine': { gdp: 0.02, population: 5 },
  'European Union': { gdp: 18.0, population: 450 },
};

export function calculateExpectedCoverage(gdpTrillions: number, populationMillions: number): number {
  if (!gdpTrillions || gdpTrillions <= 0) gdpTrillions = 0.001;
  if (!populationMillions || populationMillions <= 0) populationMillions = 0.01;
  return Math.pow(gdpTrillions, 0.75) * Math.pow(populationMillions, 0.25);
}

export function getLevel(normalizedScore: number): CoverageLevel {
  if (normalizedScore === 0) return 'none';
  if (normalizedScore < 0.2) return 'veryLow';
  if (normalizedScore < 0.5) return 'low';
  if (normalizedScore < 1.0) return 'medium';
  if (normalizedScore < 2.0) return 'high';
  return 'veryHigh';
}

export function getCountryWeight(countryName: string): CountryWeight | null {
  return COUNTRY_WEIGHTS[countryName] || null;
}

function getMedianNonZeroCount(counts: number[]): number {
  const nonZero = counts.filter((c) => c > 0).sort((a, b) => a - b);
  if (nonZero.length === 0) return 1;
  return nonZero[Math.floor(nonZero.length / 2)];
}

export function normalizeCoverage(
  countries: { id: string; name: string }[],
  counts: number[],
  industryCount: number
): { levels: CoverageLevel[] } {
  const levels: CoverageLevel[] = new Array(counts.length);
  const expectedCoverageMap = new Map<string, number>();

  for (const country of countries) {
    const weight = getCountryWeight(country.name);
    const expected = weight
      ? calculateExpectedCoverage(weight.gdp, weight.population)
      : 0.1;
    expectedCoverageMap.set(country.id, expected);
  }

  const expectedValues = Array.from(expectedCoverageMap.values()).sort((a, b) => a - b);
  const medianExpected = expectedValues[Math.floor(expectedValues.length / 2)] || 1;
  const medianCount = getMedianNonZeroCount(counts);

  for (let countryIdx = 0; countryIdx < countries.length; countryIdx++) {
    const country = countries[countryIdx];
    const expectedCoverage = expectedCoverageMap.get(country.id) || 0.1;
    const scaledExpected = expectedCoverage / medianExpected;

    for (let industryIdx = 0; industryIdx < industryCount; industryIdx++) {
      const idx = countryIdx * industryCount + industryIdx;
      const rawCount = counts[idx] || 0;

      if (rawCount === 0) {
        levels[idx] = 'none';
      } else {
        const normalizedScore = rawCount / (scaledExpected * medianCount);
        levels[idx] = getLevel(normalizedScore);
      }
    }
  }

  return { levels };
}

const COUNTRY_SHORT_NAMES: Record<string, string> = {
  'Bosnia And Herzegovina': 'Bosnia',
  'Central African Republic': 'CAR',
  'Democratic Republic Of Congo': 'DRC',
  'Republic of the Congo': 'Congo',
  'Saint Kitts And Nevis': 'St. Kitts',
  'Saint Vincent And The Grenadines': 'St. Vincent',
  'Sao Tome And Principe': 'São Tomé',
  'United Arab Emirates': 'UAE',
  'United States': 'USA',
  'United Kingdom': 'UK',
  'Dominican Republic': 'Dom. Republic',
  'Papua New Guinea': 'PNG',
  'Trinidad And Tobago': 'Trinidad',
  'Antigua And Barbuda': 'Antigua',
  'Equatorial Guinea': 'Eq. Guinea',
  'Brunei Darussalam': 'Brunei',
};

export function getCountryDisplayName(countryName: string): string {
  return COUNTRY_SHORT_NAMES[countryName] || countryName;
}
