'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';

export default function CommentSection({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/Posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    };

    const fetchUserId = async () => {
      const response = await fetch('/api/Auth/LoginCheck', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
      } else {
        console.error('Failed to fetch user ID:', await response.json());
      }
    };

    fetchUserId();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const response = await fetch(`/api/Posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment, userId }),
    });

    if (response.ok) {
      const addedComment = await response.json();
      setComments((prev) => [...prev, addedComment]);
      setNewComment('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(`/api/Posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } else {
      console.error('Failed to delete comment:', await response.json());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-white text-xl font-semibold">Comments</h3>
          <Button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto mt-4 space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start justify-between space-x-2 p-2 bg-gray-700 rounded-md">
              <div className="flex items-start space-x-2">
                <img
                  src={comment.profile_picture_url}
                  alt={`${comment.username}'s profile`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-gray-300 font-bold">{comment.username}</p>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              </div>
              {comment.user_id === userId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 bg-gray-700 rounded-md text-white"
          />
          <Button onClick={handleAddComment} className="mt-2 w-full">
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}