import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

const getUserIdFromSession = (cookies) => {
  const parsedCookies = cookies ? Object.fromEntries(cookies.split('; ').map(cookie => cookie.split('='))) : {};
  return parsedCookies['session'];
};

export async function GET(req) {
  const cookies = req.headers.get('cookie');
  const userId = getUserIdFromSession(cookies);

  if (userId) {
    const user = await getUsername(userId);
    if (user) {
      return NextResponse.json({ 
        userId,
        username: user.username, 
        bio: user.bio,
        profile_picture: user.profile_picture_url || '', 
        privileges: user.privileges 
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
}

const getUsername = async (userId) => {
  const res = await client.query('SELECT username, profile_picture_url, privileges, bio FROM users WHERE id = $1', [userId]);
  return res.rows[0];
};

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Invalid request, missing userId' }, { status: 400 });
    }

    const user = await getUsername(userId);

    if (user) {
      return NextResponse.json({ username: user.username, userId, pfp: user.profile_picture_url || '', privileges: user.privileges }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}