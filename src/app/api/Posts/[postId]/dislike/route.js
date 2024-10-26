import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function POST(req, { params }) {
  const { postId } = params;
  const { disliked } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE posts SET dislikes = dislikes + $1 WHERE id = $2`,
      [disliked ? -1 : 1, postId]
    );

    return NextResponse.json({ message: 'Dislike updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating dislike:', error);
    return NextResponse.json({ error: 'Failed to dislike' }, { status: 500 });
  }
}
