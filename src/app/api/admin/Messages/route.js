import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM messages');
    const response = NextResponse.json(res.rows);

    response.headers.set('Cache-Control', 'no-store, s-maxage=1, stale-while-revalidate=1');

    return response;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Error fetching messages' }, { status: 500 });
  } finally {
    await client.end();
  }
}