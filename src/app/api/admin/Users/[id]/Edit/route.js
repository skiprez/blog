import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Create the PostgreSQL client instance
const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

// Connect the client
client.connect();

export async function POST(req, { params }) {
  try {
    const { id: userId } = params;
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const query = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING *';
    const values = [username, userId];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Username updated successfully', user: result.rows[0] }, { status: 200 });

  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}