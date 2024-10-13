"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import SettingsPopup from './components/SettingsPopup';
import PostForm from './components/PostCreateForm.jsx';
import AlertCustom from './components/ui/alert.jsx';
import { Button } from './components/ui/button.jsx';

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

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
  const [showSettings, setShowSettings] = useState(false);
  const [pfp, setPfp] = useState('');

  const handleUpdateUsername = async (newUsername, profilePictureUrl) => {
    try {
      const response = await fetch('/api/UserSettings/UpdateUsername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, newUsername, profilePictureUrl }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(newUsername);
        setPfp(profilePictureUrl);
      } else {
        console.error('Failed to update username:', await response.json());
      }
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

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
            setCurrentUserId(userId);
            setCurrentUser(dataP.username);
            setPfp(dataP.profilePictureUrl);
          } else {
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
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? updatedPost : post))
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const removePost = async (postId) => {
    const response = await fetch(`/api/Posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: currentUserId }),
    });

    if (response.ok) {
      setPosts(posts.filter((post) => post.id !== postId));
      showAlert('Post removed successfully!', 'success');
    } else {
      console.error('Failed to remove post:', await response.json());
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };

  const handleChatRoute = () => {
    window.location.href = '/chat';
  };

  return (
    <motion.div className="bg-gray-900 min-h-screen flex flex-col items-center min-w-[700px]">
      <div className="flex justify-between w-full p-4 border-b border-gray-700">
        <h1 className="text-white text-4xl font-bold">Blog</h1>
        <div className="flex items-center space-x-4">
          {loggedIn ? (
            <>
              <Image src={pfp || account_icon} alt="Profile" width={40} height={40} className="rounded-full" />
              <Button onClick={handleChatRoute} className="text-gray-400 hover:text-blue-500">
                <ChatBubbleOutlineOutlinedIcon />
              </Button>
              <Button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                <LogoutOutlinedIcon />
              </Button>
              <Button onClick={() => setShowSettings(true)} className="text-gray-400 hover:text-blue-500">
                <SettingsOutlinedIcon />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="text-gray-400 hover:text-blue-500 flex items-center">
                <LoginOutlinedIcon className="mr-2" /> Log In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {loggedIn && <PostForm onAddPost={addPost} />}

      {alertOpen && (
        <AlertCustom
          open={alertOpen}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertOpen(false)}
        />
      )}

      {showSettings && (
        <SettingsPopup
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentUsername={currentUser}
          onUpdateUsername={handleUpdateUsername}
        />
      )}


      {/* {showCommentModal && (
        <CommentModal
          postId={selectedPostId}
          onClose={() => setShowCommentModal(false)}
          // Add any additional props needed for the comments
        />
      )} */}

      <div className="flex flex-col w-full max-w-2xl mt-6 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-semibold">{post.username}</h2>
              {loggedIn && currentUserId === post.userId && (
                <Button
                  variant="icon"
                  className="text-gray-400 hover:text-red-500 transition duration-300"
                  onClick={() => removePost(post.id)}
                >
                  <DeleteOutlineOutlinedIcon />
                </Button>
              )}
            </div>
            <p className="text-gray-300 mt-1">{post.content}</p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <Button
                  variant="icon"
                  onClick={() => toggleLike(post.id, post.liked)}
                  className="text-gray-400 hover:text-red-500 transition duration-300"
                >
                  <FavoriteBorderOutlinedIcon />
                  <span className="ml-1">{post.likes}</span>
                </Button>
                {/* <Button
                  variant="icon"
                  className="text-gray-400 hover:text-blue-500 transition duration-300"
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setShowCommentModal(true);
                  }}
                >
                  <ChatBubbleOutlineOutlinedIcon />
                  <span className="ml-1">{post.comments}</span>
                </Button> */}
                <Button
                  variant="icon"
                  className="text-gray-400 hover:text-blue-500 transition duration-300"
                >
                  <ShareOutlinedIcon />
                  <span className="ml-1">{post.shares}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}