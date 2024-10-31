import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function DELETE(req, { params }) {
  const { postId, commentId } = params;

  try {
    const result = await client.query(
      `
      DELETE FROM comments 
      WHERE id = $1 AND post_id = $2
      RETURNING *
      `,
      [commentId, postId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
