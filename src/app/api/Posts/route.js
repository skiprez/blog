import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET() {
  const res = await client.query('SELECT * FROM posts ORDER BY shares DESC');
  return NextResponse.json(res.rows);
}

export async function POST(req) {
    const { post } = await req.json();

    if (!post) {
        return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
    }

    try {
        const result = await client.query(
            'INSERT INTO posts (content) VALUES ($1) RETURNING *',
            [post]
        );

        console.log('Post inserted successfully:', result.rows[0]);
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting post:', error);
        return NextResponse.json({ error: 'Failed to insert post' }, { status: 500 });
    }
}