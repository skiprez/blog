import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

const getUsername = async (userId) => {
  const res = await client.query('SELECT username, profile_picture_url, privileges, bio FROM users WHERE id = $1', [userId]);
  console.log('Full query response:', res);
  return res.rows[0];
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await getUsername(userId);
    return NextResponse.json({ 
      userId,
      username: user.username, 
      bio: user.bio,
      profile_picture: user.profile_picture_url || '', 
      privileges: user.privileges 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}