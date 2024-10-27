'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import AlertCustom from '../../components/ui/alert.jsx';
import { Button } from '../../components/ui/button.jsx';

import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import account_icon from '@/public/account_icon.png';

const UserProfile = ({ params }) => {
  const { id } = params;
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

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
          setCurrentUserId(userId);
        }
      } catch (error) {
        console.error('Failed to parse response:', error);
        setLoggedIn(false);
      }
    }
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
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? updatedPost : post))
        );
        fetchUserPosts(id);
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
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? updatedPost : post))
        );
        fetchUserPosts(id);
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const response = await fetch(`/api/Auth/GetUserData?userId=${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        setBioText(data.bio);
      } else {
        showAlert('Failed to fetch user data!', 'error');
      }
    } catch (error) {
      showAlert('Error fetching user data!', 'error');
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const response = await fetch(`/api/Posts/Personal?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      } else {
        console.error('Failed to fetch user posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };

  const saveBio = async () => {
    if (currentUserId !== id) return;
    try {
      const response = await fetch(`/api/UserSettings/${currentUserId}/updateBio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: bioText }),
      });
      if (response.ok) {
        setIsEditingBio(false);
        fetchUserData(id);
        showAlert('Bio updated successfully!', 'success');
      } else {
        showAlert('Failed to update bio!', 'error');
      }
    } catch (error) {
      showAlert('Error updating bio!', 'error');
    }
  };

  useEffect(() => {
    if (id) {
      checkLoginStatus();
      fetchUserData(id);
      fetchUserPosts(id);
    }
  }, [id]);

  return (
    <div className="bg-gray-900 min-h-screen min-w-[380px] md:min-w-[600px] max-w-[630px] flex flex-col items-center p-4">
      {alertOpen && (
        <AlertCustom
          open={alertOpen}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertOpen(false)}
        />
      )}
      {userInfo ? (
        <div className="text-white flex flex-col items-center max-w-[380px]">
          <Link href="/" className=" mr-[300px] md:mr-[500px]">
            <Button className="text-gray-400 hover:text-blue-500">
              <LogoutOutlinedIcon />
            </Button>
          </Link>
          <Image src={userInfo.profile_picture || account_icon} alt="Profile" width={100} height={100} className="rounded-full mt-4" />
          <h1 className="text-3xl font-bold">{userInfo.username}</h1>
          <div className="flex flex-col items-center mt-2">
            {isEditingBio && currentUserId === id ? (
              <>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="text-gray-700 mt-2 max-w-[500px] p-2 rounded outline-none border-none"
                />
                <Button onClick={saveBio} className="mt-2 text-blue-500">
                  Save Bio
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 max-w-[500px]">Bio: {userInfo.bio}</p>
                {currentUserId === id && (
                  <p
                    className="mt-[1px] text-blue-300 cursor-pointer"
                    onClick={() => setIsEditingBio(true)}
                  >
                    Edit Bio
                  </p>
                )}
              </>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold">Posts:</h2>
          <div className="flex flex-col gap-4 mt-2">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className="bg-gray-800 rounded-lg p-4 min-w-[370px] max-w-[370px] md:min-w-[400px] md:max-w-[700px] flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <Image src={userInfo.profile_picture || account_icon} alt="Profile" width={50} height={50} className="rounded-full" />
                    <h1 className="text-xl font-bold">{userInfo.username}</h1>
                  </div>
                  <p className="ml-10">{post.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 items-center">
                      <Button
                        variant="icon"
                        onClick={() => toggleLike(post.id, post.liked)}
                        className="text-gray-400 hover:text-blue-500 transition duration-300"
                      >
                        <ThumbUpOutlinedIcon />
                        <span className="ml-1">{post.likes}</span>
                      </Button>
                      <Button
                        variant="icon"
                        onClick={() => toggleDislike(post.id, post.disliked)}
                        className="text-gray-400 hover:text-red-500 transition duration-300"
                      >
                        <ThumbUpOutlinedIcon style={{ transform: 'rotate(180deg)' }} />
                        <span className="ml-1">{post.dislikes}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts found for this user.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-white">Loading user information...</p>
      )}
    </div>
  );
};

export default UserProfile;