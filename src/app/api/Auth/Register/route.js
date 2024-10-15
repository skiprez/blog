import { Client } from 'pg';
import bcrypt from 'bcrypt';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function POST(req) {
  const { username, password } = await req.json();

  // Validate request body
  if (!username || !password) {
    return new Response(JSON.stringify({ message: 'Username and password are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    return new Response(
      JSON.stringify({ message: 'User registered successfully!', userId: result.rows[0].id }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}