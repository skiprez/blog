import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const res = await client.query(
      `
      SELECT p.*, u.username 
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.likes DESC
    `,
      [userId]
    );
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}