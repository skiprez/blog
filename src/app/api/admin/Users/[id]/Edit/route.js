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
    // Extract userId from the params (URL)
    const { id: userId } = params; // 'id' corresponds to the [id] dynamic route segment
    const { username } = await req.json();

    // Log the received data (for debugging purposes)
    console.log("Received data:", { userId, username });

    // Input validation
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    // Define the SQL query to update the username
    const query = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING *';
    const values = [username, userId];

    // Execute the query
    const result = await client.query(query, values);

    console.log("Update query executed. Rows affected:", result.rowCount);

    // Check if no user was found and updated
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // If successful, return the updated user data
    return NextResponse.json({ message: 'Username updated successfully', user: result.rows[0] }, { status: 200 });

  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}