import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET() {
  const res = await client.query(`
    SELECT m.id, m.user_id, m.content, m.created_at, u.username
    FROM messages m
    JOIN users u ON m.user_id::uuid = u.id
    ORDER BY m.created_at ASC
  `);
  return NextResponse.json(res.rows);
}

export async function POST(request) {
  const { user_id, content } = await request.json();

  console.log('Received Message Data:', { user_id, content });

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const res = await client.query(
    'INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
    [user_id, content]
  );

  return NextResponse.json(res.rows[0]);
}