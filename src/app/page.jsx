"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PostForm from './components/PostCreateForm.jsx';
import AlertCustom from './components/ui/alert.jsx';
import { Button } from './components/ui/button.jsx';

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import account_icon from '../public/account_icon.png';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [removingPostId, setRemovingPostId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const responseG = await fetch('/api/Auth/LoginCheck', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (responseG.ok) {
        try {
          const dataG = await responseG.json();
          const userId = dataG.userId;
          console.log('Fetched userId:', userId);
  
          const responseP = await fetch('/api/Auth/LoginCheck', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
  
          if (responseP.ok) {
            const dataP = await responseP.json();
            setLoggedIn(true);
            setCurrentUserId(userId); // Set the userId from GET response
            setCurrentUser(dataP.username); // Set the username from POST response
            console.log('Logged in user:', dataP.username);
            console.log('Current user:', dataG.userId);
          } else {
            console.error('POST request failed', responseP.status);
            setLoggedIn(false);
          }
        } catch (error) {
          console.error('Failed to parse response:', error);
          setLoggedIn(false);
        }
      }
    };
  
    const fetchPosts = async () => {
      const response = await fetch('/api/Posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', await response.json());
      }
    };

    checkLoginStatus();
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    const response = await fetch('/api/Auth/Logout', {
      method: 'POST',
      credentials: 'include',
    });
  
    if (response.ok) {
      setLoggedIn(false);
      setCurrentUserId(null);
      showAlert('Logged out successfully!', 'info');
    }
  };

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
    const intervalId = setInterval(fetchPosts, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
    showAlert('Post added successfully!', 'success');
  };

  const toggleLike = async (postId, liked) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked }),
      });
  
      if (response.ok) {
        showAlert(liked ? 'Post unliked!' : 'Post liked!', 'success');
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
        showAlert(shared ? 'Post unshared!' : 'Post shared!', 'info');
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

  const deletePost = async (postId) => {
    setRemovingPostId(postId);
    try {
      const response = await fetch(`/api/Posts/${postId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        showAlert('Post deleted successfully!', 'error');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setRemovingPostId(null);
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <main className="flex flex-col justify-center max-w-full px-4 md:w-[700px] mx-auto">
      {/* Home Transport */}
      <div className="text-white font-semibold text-xl border-b border-white w-full p-2 flex justify-between mb-2">
        <Link href="/" className="relative group">Home
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-white scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
        <Link href="/chat" className="relative group">Chat
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-white scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      </div>

      {/* Create a Post */}
      {loggedIn ? (
        <div className="border-b border-white w-full min-h-[150px] p-4 flex flex-col rounded-lg bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image src={account_icon} className="w-[50px] h-[50px] rounded-full" />
              <p className="text-white font-semibold text-md ml-2">
                {currentUser ? `${currentUser}` : 'Guest'}
              </p>
            </div>
            <div className="flex justify-between w-[90px]">
              {loggedIn && (
                <Button className="w-10 h-10">
                  <SettingsOutlinedIcon />
                </Button>
              )}
              {loggedIn && (
                <Button onClick={handleLogout} className="w-10 h-10">
                  <LogoutOutlinedIcon />
                </Button>
              )}
            </div>
          </div>
          <PostForm onAddPost={addPost} />
        </div>
      ) : (
        <div className="border-b border-white w-full min-h-[150px] p-4 flex flex-col rounded-lg bg-gray-800 shadow-lg">
          <p className="text-white font-semibold text-md">You are not logged in. Please log in to create posts.</p>
          <Link href="/login">
            <Button className="mt-2">Login</Button>
          </Link>
        </div>
      )}

      {/* Scrolling Menu */}
      <div className="text-white text-md border-white md:w-full w-screen md:max-h-[680px] max-h-[550px] overflow-y-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className={`border-b w-full border-white min-h-[120px] mt-4 flex flex-col p-4 transition-all bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md ${removingPostId === post.id ? 'fade-out' : 'fade-in'}`}>
              {/* User Info */}
              <div className="flex items-center mb-2">
                <Image src={account_icon} className="w-[50px] h-[50px] rounded-full" />
                <p className="text-white font-semibold text-md ml-2">
                  {post.username ? post.username : 'Guest'} {/* Updated to use username */}
                </p>
                {/* Show delete button if the user is the post owner */}
                {post.user_id === currentUserId && (
                  <Button variant="icon" size="icon" onClick={() => deletePost(post.id)} className="ml-auto">
                    <DeleteOutlineOutlinedIcon className="text-red-600" />
                  </Button>
                )}
              </div>

              {/* Post Content */}
              <div className="flex flex-col">
                <p className="text-lg">{post.content}</p>
                {post.file_url && (
                  <Image src={post.file_url} alt="Uploaded file" className="max-w-full mb-2 mt-2 rounded-md shadow-lg" />
                )}
              </div>

              {/* Post Actions */}
              <div className="mt-2 flex justify-between">
                {/* Like Action */}
                <div className="flex items-center">
                  <Button variant="icon" size="icon" className="scale-on-hover" onClick={() => toggleLike(post.id, post.userLiked)}>
                    <FavoriteBorderOutlinedIcon className={post.userLiked ? "text-red-600" : "text-white"} />
                  </Button>
                  <span className="text-white ml-1">{post.likes || 0}</span>
                </div>

                {/* Share Action */}
                <div className="flex items-center">
                  <Button variant="icon" size="icon" className="scale-on-hover" onClick={() => toggleShare(post.id, post.userShared)}>
                    <ShareOutlinedIcon className={post.userShared ? "text-green-600" : "text-white"} />
                  </Button>
                  <span className="text-white ml-1">{post.shares || 0}</span>
                </div>

                {/* Comment Action */}
                <div className="flex items-center">
                  <Button variant="icon" size="icon" className="scale-on-hover">
                    <ChatBubbleOutlineOutlinedIcon className="text-white" />
                  </Button>
                  <span className="text-white ml-1">{post.comments || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white font-semibold text-2xl text-center mt-20">No posts available</p>
        )}
      </div>

      {/* Alert */}
      <AlertCustom
        open={alertOpen} 
        message={alertMessage} 
        type={alertType} 
        onClose={handleAlertClose} 
        className={alertOpen ? 'slide-in' : ''}
      />
    </main>
  );
}