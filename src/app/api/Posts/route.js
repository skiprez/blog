import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET() {
  try {
    const res = await client.query('SELECT * FROM posts ORDER BY shares DESC');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req) {
    const { post, userId } = await req.json();

    if (!post || !userId) {
        return NextResponse.json({ error: 'Post content and userId are required' }, { status: 400 });
    }

    try {
        const result = await client.query(
            'INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *',
            [post, userId]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting post:', error);
        return NextResponse.json({ error: 'Failed to insert post' }, { status: 500 });
    }
}
