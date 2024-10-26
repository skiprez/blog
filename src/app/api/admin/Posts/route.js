import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM posts');
    const response = NextResponse.json(res.rows);

    response.headers.set('Cache-Control', 'no-store, s-maxage=1, stale-while-revalidate=1');

    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  } finally {
    await client.end(); // Close connection after querying
  }
}