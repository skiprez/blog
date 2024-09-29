"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PostForm from './components/PostCreateForm.jsx';
import { Button } from './components/ui/button.jsx';

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import account_icon from '../public/account_icon.png';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/Posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', response.statusText);
      }
    };

    fetchPosts();
  }, []);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const toggleLike = async (postId, liked) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked }),
      });
  
      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + (liked ? -1 : 1), userLiked: !liked }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };  

  const toggleShare = async (postId, shared) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shared }),
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, shares: post.shares + (shared ? -1 : 1), userShared: !shared }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle share:', error);
    }
  };

  return (
    <main className="flex flex-col justify-center w-[700px]">
      {/* Home Transport */}
      <div className="text-white font-semibold text-xl border-b-[1px] border-x-[1px] border-white w-[700px] p-2 justify-between flex">
        <Link href="/" className="relative group">
          Home
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-white scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
        <Link href="/chat" className="relative group">
          Chat
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-white scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      </div>

      {/* Create a Post */}
      <div className="border-b-[1px] border-x-[1px] border-white w-[700px] min-h-[150px] p-2">
        {/* User Info */}
        <div className="flex flex-row max-w-[200px]">
          <Image src={account_icon} className="w-[50px] h-[50px] rounded-full mb-2" />
          <p className="text-white font-semibold text-md ml-2">Guest</p>
        </div>

        {/* Post Content */}
        <div className="flex flex-col items-center">
          <PostForm onAddPost={addPost} />
        </div>
      </div>

      {/* Scrolling Menu */}
      <div className="text-white text-md border-b-[1px] border-x-[1px] border-white w-[700px] h-[800px] overflow-y-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border-b-[1px] border-white min-h-[100px] mt-2 flex flex-col p-2">
              {/* User Info */}
              <div className="flex flex-row max-w-[200px]">
                <Image src={account_icon} className="w-[50px] h-[50px] rounded-full mb-2" />
                <p className="text-white font-semibold text-md ml-2">Guest</p>
              </div>

              {/* Post Content */}
              <div className="mt-[-30px] ml-[70px] max-w-[580px] flex flex-col">
                <p>{post.content}</p>
                {post.file_url && (
                  <Image src={post.file_url} alt="Uploaded file" className="max-w-[550px] mb-2 mt-2 rounded-md shadow-lg" />
                )}
              </div>

              {/* Post Actions */}
              <div className="mt-2 flex flex-row justify-around">
                {/* Like Action */}
                <div className="flex flex-row max-w-[120px] items-center justify-between">
                  <Button variant="icon" size="icon" onClick={() => toggleLike(post.id, post.userLiked)}>
                    <FavoriteBorderOutlinedIcon className={post.userLiked ? "text-red-600" : "text-white"} />
                  </Button>
                  <p className="text-xl mb-1 ml-2">{post.likes}</p>
                </div>

                {/* Comment Action */}
                <div className="flex flex-row max-w-[120px] items-center justify-between">
                  <Button variant="icon" size="icon">
                    <ChatBubbleOutlineOutlinedIcon className="text-green-600" />
                  </Button>
                  <p className="text-xl mb-1 ml-2">24</p>
                </div>

                {/* Share Action */}
                <div className="flex flex-row max-w-[120px] items-center justify-between">
                  <Button variant="icon" size="icon" onClick={() => toggleShare(post.id, post.userShared)}>
                    <ShareOutlinedIcon className={post.userShared ? "text-blue-600" : "text-white"} />
                  </Button>
                  <p className="text-xl mb-1 ml-2">{post.shares}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No posts available.</p>
        )}
      </div>
    </main>
  );
}