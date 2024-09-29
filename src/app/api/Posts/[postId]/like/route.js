import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function POST(req, { params }) {
  const { postId } = params;
  const { liked } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE posts SET likes = likes + $1 WHERE id = $2`,
      [liked ? -1 : 1, postId]
    );

    return NextResponse.json({ message: 'Like updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}
