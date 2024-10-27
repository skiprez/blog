import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const followerId = searchParams.get('followerId');
  const followedId = searchParams.get('followedId');

  try {
    const result = await client.query(
      `SELECT EXISTS (
         SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2
       ) AS isFollowing`,
      [followerId, followedId]
    );

    const isFollowing = result.rows[0]?.isFollowing || false;
    return NextResponse.json({ isFollowing }, { status: 200 });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json({ error: "Error checking follow status." }, { status: 500 });
  }
}