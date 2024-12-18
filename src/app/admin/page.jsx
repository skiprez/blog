'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Button } from '../components/ui/button.jsx';
import SettingsModal from '../components/SettingsModal';

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchOptions = { cache: 'no-store' };

      const fetchUsers = async () => {
        try {
          const response = await fetch(`/api/admin/Users?timestamp=${Date.now()}`, fetchOptions);
          const data = await response.json();
          setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/admin/Messages?timestamp=${Date.now()}`, fetchOptions);
          const data = await response.json();
          setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/admin/Posts?timestamp=${Date.now()}`, fetchOptions);
          const data = await response.json();
          setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      await Promise.all([fetchUsers(), fetchMessages(), fetchPosts()]); // Fetch all data in parallel

      // Refresh data every 5 seconds
      const intervalId = setInterval(() => {
        fetchUsers();
        fetchMessages();
        fetchPosts();
      }, 5000);
      
      return () => clearInterval(intervalId);
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`/api/admin/Users/${userId}/Delete`, {
        method: 'DELETE',
        cache: 'no-store'
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      await fetch(`/api/admin/Users/${updatedUser.id}/Edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
        credentials: 'include',
        cache: 'no-store'
      });
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await fetch(`/api/admin/Messages/${messageId}/Delete`, {
        method: 'DELETE',
        cache: 'no-store'
      });
      setMessages(messages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetch(`/api/admin/Posts/${postId}/Delete`, {
        method: 'DELETE',
        cache: 'no-store'
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleOpenSettings = (user) => {
    setSelectedUser(user);
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col h-screen w-[700px] bg-gray-900">
      <header className="flex justify-between w-[700px] p-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome to the Admin Dashboard</h1>
          <p className="mt-4 text-white">Here you can manage the application.</p>
        </div>

        <div className="bg-gray-800 w-[55px] h-[190px] flex flex-col justify-evenly rounded-md items-center">
          <Button variant="icon" className="text-gray-400 hover:text-blue-500 h-[40px] w-[40px]">
            <Link href='#user-management'>
              <AccountCircleOutlinedIcon />
            </Link>
          </Button>
          <Button variant="icon" className="text-gray-400 hover:text-blue-500 h-[40px] w-[40px]">
            <Link href='#messages'>
              <ForumOutlinedIcon />
            </Link>
          </Button>
          <Button variant="icon" className="text-gray-400 hover:text-blue-500 h-[40px] w-[40px]">
            <Link href='#posts'>
              <LocalPostOfficeOutlinedIcon />
            </Link>
          </Button>
          <Button variant="icon" className="text-gray-400 hover:text-blue-500 h-[40px] w-[40px]">
            <Link href='/' >
              <LogoutOutlinedIcon />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-col justify-between overflow-scroll">
        <div id="user-management" className="p-4">
          <h2 className="text-2xl font-bold text-white mt-4">User Management</h2>
          <div className="flex flex-col gap-4 p-4">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                <div className="text-white max-w-[450px]"> ID: {user.id}, USERNAME: {user.username}</div>
                <div>
                  <Button variant="icon" className="text-blue-400" onClick={() => handleOpenSettings(user)}>
                    <SettingsOutlinedIcon />
                  </Button>
                  <Button variant="icon" className="text-red-400" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteOutlinedIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="messages" className="p-4">
          <h2 className="text-2xl font-bold text-white mt-4">Messages</h2>
          <div className="flex flex-col gap-4 p-4">
            {messages.map(message => (
              <div key={message.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                <div className="text-white max-w-[450px]">
                  ID: {message.id}, MESSAGE: {message.content}
                </div>
                <div>
                  <Button variant="icon" className="text-red-400" onClick={() => handleDeleteMessage(message.id)}>
                    <DeleteOutlinedIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="posts" className="p-4">
          <h2 className="text-2xl font-bold text-white mt-4">Posts</h2>
          <div className="flex flex-col gap-4 p-4">
            {posts.map(post => (
              <div key={post.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                <div className="text-white max-w-[450px]">
                  ID: {post.id}, CONTENT: {post.content}
                </div>
                <div>
                  <Button variant="icon" className="text-red-400" onClick={() => handleDeletePost(post.id)}>
                    <DeleteOutlinedIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedUser && (
        <SettingsModal
          open={openSettings}
          handleClose={handleCloseSettings}
          user={selectedUser}
          handleEditUser={handleEditUser}
        />
      )}
    </div>
  );
}