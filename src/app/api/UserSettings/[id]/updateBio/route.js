import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req, { params }) {
  const { id } = params;
  const { bio } = await req.json();

  if (!bio) {
    return NextResponse.json({ error: 'Bio content is required' }, { status: 400 });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();

    const result = await client.query(
      'UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio',
      [bio, id]
    );

    await client.end();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ bio: result.rows[0].bio }, { status: 200 });
  } catch (error) {
    console.error('Error updating bio:', error);
    return NextResponse.json({ error: 'Error updating bio' }, { status: 500 });
  }
}
