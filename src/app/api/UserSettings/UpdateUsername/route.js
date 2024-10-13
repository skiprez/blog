import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function POST(req) {
  const { userId, newUsername, profilePictureUrl } = await req.json();
  
  console.log("Received data:", { userId, newUsername, profilePictureUrl });

  try {
    const query = 'UPDATE users SET username = $1, profile_picture_url = $2 WHERE id = $3';
    const values = [newUsername, profilePictureUrl || null, userId];
    const result = await client.query(query, values);

    console.log("Update query executed. Rows affected:", result.rowCount);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Username updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}