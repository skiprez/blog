import { NextResponse } from 'next/server';
import { Client } from 'pg';
export const fetchCache = 'force-no-store';
export async function GET() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM users');
    const response = NextResponse.json(res.rows);

    response.headers.set('Cache-Control', 'no-store, s-maxage=1, stale-while-revalidate=1');

    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  } finally {
    await client.end();
  }
}