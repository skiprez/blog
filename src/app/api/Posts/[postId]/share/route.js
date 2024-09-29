import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function POST(req, { params }) {
  const { postId } = params;

  try {
    const result = await pool.query(
      `UPDATE posts SET shares = shares + 1 WHERE id = $1`,
      [postId]
    );

    return NextResponse.json({ message: 'Share count updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating share:', error);
    return NextResponse.json({ error: 'Failed to update share' }, { status: 500 });
  }
}