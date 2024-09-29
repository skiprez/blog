import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function DELETE(req, { params }) {
  const { postId } = params;

  try {
    const result = await pool.query(
      `DELETE FROM posts WHERE id = $1`,
      [postId]
    );

    // Check if the post was deleted (affected rows)
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
