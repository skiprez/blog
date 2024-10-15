import pool from '../../../../../lib/db';

export async function DELETE(req, { params }) {
  const { postId } = params;
  const { userId } = await req.json();

  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [postId, userId]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'Unauthorized or post not found' }), { status: 403 });
    }

    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}