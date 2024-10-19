import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Create the PostgreSQL client
const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

// DELETE method to remove a user
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}