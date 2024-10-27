import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function POST(req) {
    const requestBody = await req.json();

    const { followerId, followedId } = requestBody;

    if (!followerId || !followedId) {
        return NextResponse.json({ error: "Missing followerId or followedId." }, { status: 400 });
    }

    if (followerId === followedId) {
        return NextResponse.json({ error: "You cannot follow yourself." }, { status: 400 });
    }

    try {
        await client.query(
            `INSERT INTO follows (follower_id, followed_id, timestamp) VALUES ($1, $2, NOW()) 
             ON CONFLICT DO NOTHING`,
            [followerId, followedId]
        );

        return NextResponse.json({ message: "Followed successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error following user:", error);
        return NextResponse.json({ error: "Error following user." }, { status: 500 });
    }
}

export async function DELETE(req) {
  const { followerId, followedId } = await req.json();

  try {
    await client.query(
      `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2`,
      [followerId, followedId]
    );

    return NextResponse.json({ message: "Unfollowed successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json({ error: "Error unfollowing user." }, { status: 500 });
  }
}
