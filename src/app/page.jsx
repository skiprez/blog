'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import SettingsPopup from './components/SettingsPopup';
import CommentSection from './components/CommentSection.jsx';
import PostForm from './components/PostCreateForm.jsx';
import AlertCustom from './components/ui/alert.jsx';
import { Button } from './components/ui/button.jsx';

import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

import account_icon from '../public/account_icon.png';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState(0);
  const [pfp, setPfp] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleUpdateUsername = async (newUsername, profile_picture_url) => {
    try {
      const response = await fetch('/api/UserSettings/UpdateUsername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, newUsername, profile_picture_url }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(newUsername);
        setPfp(profile_picture_url);
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
            console.log('Response Data:', dataP);
            setLoggedIn(true);
            setCurrentUserId(userId);
            setCurrentUser(dataP.username);
            setUserPrivileges(dataP.privileges);
            setPfp(dataP.pfp);
          } else {
            setLoggedIn(false);
          }
        } catch (error) {
          console.error('Failed to parse response:', error);
          setLoggedIn(false);
        }
      }
    };

    checkLoginStatus();
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
  
  const toggleDislike = async (postId, disliked) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/dislike/`, {
        method: disliked ? 'DELETE' : 'POST',
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
      console.error('Error toggling dislike:', error);
    }
  };  

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/Posts/${postId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        showAlert('Post deleted successfully!', 'success');
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        const data = await response.json();
        console.error('Failed to delete post:', data.message);
        showAlert('Failed to delete post!', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showAlert('Error deleting post!', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };

  const handleOpenComments = (postId) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);
  };

  const handleCloseComments = () => {
    setShowCommentModal(false);
    setSelectedPostId(null);
  };

  const handleChatRoute = () => {
    window.location.href = '/chat';
  };

  return (
    <motion.div className="bg-gray-900 min-h-screen flex flex-col items-center px-4 min-w-[390px] max-w-[390px] md:min-w-[670px] md:max-w-[700px]">
      <div className="flex justify-between w-full p-4 border-b border-gray-700">
        <h1 className="text-white text-2xl font-bold">Tech Threads</h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          {loggedIn ? (
            <>
              <Link href={`/user/${currentUserId}`}>
                <Image
                  src={pfp || account_icon}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full cursor-pointer"
                />
              </Link>
              <Button onClick={handleChatRoute} className="text-gray-400 hover:text-blue-500">
                <ChatBubbleOutlineOutlinedIcon />
              </Button>
              {userPrivileges > 2 && (
                <Link href="/admin">
                  <Button className="text-gray-400 hover:text-blue-500">
                    <AdminPanelSettingsOutlinedIcon />
                  </Button>
                </Link>
              )}
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

      <div className="flex flex-col gap-4 mt-8 w-full max-h-[650px] overflow-auto custom-scrollbar">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Link href={`/user/${post.user_id}`}>
                    <Image
                      src={post.profile_picture_url || account_icon}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                    />
                  </Link>
                  <Link href={`/user/${post.user_id}`} className="text-white text-lg font-semibold cursor-pointer hover:text-blue-500">
                    {post.username}
                  </Link>
                </div>
                {post.user_id === currentUserId && (
                  <Button onClick={() => deletePost(post.id)} className="text-gray-400 hover:text-red-500">
                    <DeleteOutlinedIcon />
                  </Button>
                )}
              </div>
              <p className="text-gray-300 mt-4 mb-4 ml-4 text-lg">{post.content}</p>
              {post.file_path && (
                <Image src={post.file_path} alt="Post media" width={350} height={350} className="object-cover rounded-md mx-auto mb-4" />
              )}
              <div className="flex space-x-3 items-center">
                <Button onClick={() => toggleLike(post.id, post.liked)} className="text-gray-400 hover:text-blue-500 w-[50px] h-[35px]">
                  <ThumbUpOutlinedIcon />
                  <span className="ml-1">{post.likes}</span>
                </Button>
                <Button onClick={() => toggleDislike(post.id, post.disliked)} className="text-gray-400 hover:text-red-500 w-[50px] h-[35px]">
                  <ThumbUpOutlinedIcon className="transform rotate-180" />
                  <span className="ml-1">{post.dislikes}</span>
                </Button>
                <Button onClick={() => handleOpenComments(post.id)} className="text-gray-400 hover:text-blue-500 w-[50px] h-[35px]">
                  <ChatBubbleOutlineOutlinedIcon />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No posts found.</p>
        )}
        <Link class="text-center text-blue-400 border-t-2 p-2" href="/patch-notes">Patch Notes</Link>
      </div>

      {showCommentModal && (
        <CommentSection postId={selectedPostId} onClose={handleCloseComments} />
      )}
    </motion.div>
  );
}