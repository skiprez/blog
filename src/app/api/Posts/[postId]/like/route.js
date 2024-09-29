// pages/api/Posts/[postId]/like.js
import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { pusher } from '../../../../../lib/pusher';

export async function POST(req, { params }) {
  const { postId } = params;
  const { liked } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE posts SET likes = likes + $1 WHERE id = $2`,
      [liked ? -1 : 1, postId]
    );

    // Broadcast the like event to Pusher
    await pusher.trigger('post-channel', 'post-liked', {
      postId,
      likesChange: liked ? -1 : 1,
    });

    return NextResponse.json({ message: 'Like updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}