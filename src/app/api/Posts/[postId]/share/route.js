// pages/api/Posts/[postId]/share.js
import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { pusher } from '../../../../../lib/pusher';

export async function POST(req, { params }) {
  const { postId } = params;

  try {
    const result = await pool.query(
      `UPDATE posts SET shares = shares + 1 WHERE id = $1`,
      [postId]
    );

    // Broadcast the share event to Pusher
    await pusher.trigger('post-channel', 'post-shared', {
      postId,
      sharesChange: 1,
    });

    return NextResponse.json({ message: 'Share updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating share:', error);
    return NextResponse.json({ error: 'Failed to update share' }, { status: 500 });
  }
}