import { Client } from 'pg';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

await client.connect();

const getUserByUsername = async (username) => {
  const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};

export async function POST(req) {
  console.log("Login API hit");
  try {
    const { username, password } = await req.json();
    console.log("Received username:", username);
    const user = await getUserByUsername(username);
    
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Login successful', userId: user.id });
    response.cookies.set('session', user.id, { httpOnly: true, path: '/' });

    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}