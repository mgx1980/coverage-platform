import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<{ rows: T[] }> {
  const client = getPool();
  const result = await client.query(text, params);
  return { rows: result.rows as T[] };
}
