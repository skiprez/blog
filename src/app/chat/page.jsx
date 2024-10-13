'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './../components/ui/button.jsx';
import { Input } from './../components/ui/input.jsx';
import { Card, CardContent } from "./../components/ui/card.jsx";
import IconButton from '@mui/material/IconButton';
import { ExitToApp } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import account_icon from './../../public/account_icon.png';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null); // Use null to indicate loading state
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Fetch user ID and messages
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/Auth/LoginCheck', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log('User ID Response:', data); // Log the response data
        if (response.ok) {
          setUserId(data.userId);
        } else {
          console.error('Error fetching user ID:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };         

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/Messages');
        const data = await response.json();
        if (response.ok) {
          setMessages(data);
        } else {
          console.error('Error fetching messages:', data.message);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserId();
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 4000);

    return () => clearInterval(intervalId);
  }, []);

  // Scroll to the bottom of the messages
  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !userId) {
      console.log('Cannot send message. User ID:', userId, 'New Message:', newMessage);
      return; // Ensure both fields are not empty
    }
  
    const newMessageData = { user_id: userId, content: newMessage };
    console.log('Sending message:', newMessageData);
    
    // Optimistically update messages
    setMessages((prev) => [...prev, { ...newMessageData, id: Date.now(), created_at: new Date() }]);
  
    try {
      const response = await fetch('/api/Messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessageData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending message:', errorData);
        setAlertMessage('Error sending message: ' + errorData.message);
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
        return;
      }
  
      const savedMessage = await response.json();
      console.log('Saved Message:', savedMessage);
      setAlertMessage('Message sent successfully!');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setAlertMessage('Error sending message!');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
    }
  
    setNewMessage('');
  };  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents new line in the input
      handleSendMessage(); // Call handleSendMessage directly
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-center text-2xl font-bold text-white">Chat of All Users</h1>
        <Link href="/">
          <IconButton color="inherit">
            <ExitToApp className="text-white"/>
          </IconButton>
        </Link>
      </div>

      {/* Display User ID */}
      <div className="text-center text-white">
        {userId !== null ? (
          userId ? <p>User ID: {userId}</p> : <p>Not logged in.</p>
        ) : (
          <p>Loading User ID...</p>
        )}
      </div>

      {/* Message List */}
      <div
        className="flex-grow overflow-y-auto p-4 backdrop-filter backdrop-blur-lg bg-black/30 rounded-lg"
        onScroll={() => setIsUserScrolling(true)}
        onMouseEnter={() => setIsUserScrolling(false)}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`} key={message.id}>
              <Card className={`shadow-md rounded-lg border-0 max-w-[75%] ${message.user_id === userId ? 'bg-blue-600' : 'bg-gray-600'}`}>
                <CardContent className="p-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Link href={`/user/${message.user_id}`} className="mt-2">
                      <Image 
                        src={account_icon} 
                        className="w-[45px] sm:w-[30px] sm:h-[30px] rounded-full mb-[7px] object-cover" 
                        alt="Account Icon" 
                        width={30} 
                        height={30} 
                      />
                    </Link>
                    <Link href={`/user/${message.user_id}`}>
                      <span className="text-white font-semibold">{message.username}</span> {/* Display username here */}
                    </Link>
                    <span className="text-gray-300 text-xs">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg text-white">
                    {message.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Send Message */}
      <div className="p-4 bg-gray-800 shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center">
          <Input
            type="text"
            placeholder="Type your message..."
            className="mr-2 mb-2 md:mb-0 md:flex-grow"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Set onKeyDown here
          />
          <Button className="transition-transform hover:scale-105" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>

      {/* Alert for message sending in the bottom right corner */}
      {alertOpen && (
        <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }} className="slide-in">
          <Alert severity={alertMessage.includes('Error') ? 'error' : 'success'} onClose={() => setAlertOpen(false)}>
            {alertMessage}
          </Alert>
        </div>
      )}
    </div>
  );
}