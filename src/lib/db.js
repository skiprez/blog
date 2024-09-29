import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default pool;

export async function POST(req) {
    const { post, file_url } = await req.json();

    try {
        const result = await pool.query(
            'INSERT INTO posts (content, file_url) VALUES ($1, $2) RETURNING *',
            [post, file_url]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}