import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default pool;

export async function POST(req) {
    const { post, file_url } = await req.json();

    try {
        // Insert the new post
        const result = await pool.query(
            'INSERT INTO posts (content, file_path) VALUES ($1, $2) RETURNING *',
            [post, file_url]
        );

        const newPost = result.rows[0];

        // Check the number of posts and delete the oldest if needed
        const countResult = await pool.query('SELECT COUNT(*) FROM posts');
        const postCount = parseInt(countResult.rows[0].count, 10);

        if (postCount >= 30) {
            // Delete the 3 oldest posts
            await pool.query(
                'DELETE FROM posts WHERE id IN (SELECT id FROM posts ORDER BY created_at ASC LIMIT 3)'
            );
        }

        return NextResponse.json(newPost);
    } catch (error) {
        console.error('Error inserting post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
