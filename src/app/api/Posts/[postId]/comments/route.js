import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET(req, { params }) {
    const { postId } = params;
  
    try {
      const result = await client.query(
        `
        SELECT comments.id, comments.content, comments.created_at, 
        users.username, users.profile_picture_url
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at DESC
        `,
        [postId]
      );
  
      const comments = result.rows;
      return NextResponse.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
  }
  
  export async function POST(req, { params }) {
    const { postId } = params;
    const { content, userId } = await req.json();
  
    try {
      // Handle adding a new comment
      const result = await client.query(
        `
        INSERT INTO comments (content, post_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, content, created_at, user_id
        `,
        [content, postId, userId]
      );
  
      const newComment = result.rows[0];
      return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
  }