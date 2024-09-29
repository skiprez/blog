import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET() {
  const res = await client.query('SELECT * FROM messages ORDER BY created_at ASC');
  return NextResponse.json(res.rows);
}

export async function POST(request) {
  const { user_id, content } = await request.json();
  
  const res = await client.query('INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *', [user_id, content]);
  
  const countRes = await client.query('SELECT COUNT(*) FROM messages');
  const messageCount = parseInt(countRes.rows[0].count, 10);
  
  if (messageCount > 100) {
    await client.query('DELETE FROM messages WHERE id IN (SELECT id FROM messages ORDER BY created_at ASC LIMIT 5)');
  }
  
  return NextResponse.json(res.rows[0]);
}
