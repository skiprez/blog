'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from './../components/ui/button.jsx';
import { Input } from './../components/ui/input.jsx';
import { Card, CardContent } from "./../components/ui/card.jsx";
import Alert from '@mui/material/Alert';

import IconButton from '@mui/material/IconButton';
import { ExitToApp } from '@mui/icons-material';

import account_icon from './../../public/account_icon.png';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isCooldown, setIsCooldown] = useState(false); // Cooldown state

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

  // Handle sending a new message with a one-minute cooldown
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !userId || isCooldown) {
      return; 
    }
  
    const newMessageData = { user_id: userId, content: newMessage };
    
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
        setAlertMessage('Error sending message: ' + errorData.message);
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
        return;
      }
  
      const savedMessage = await response.json();
      setAlertMessage('Message sent successfully!');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);

      // Trigger cooldown for one minute
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 30000); // 30s
      
    } catch (error) {
      setAlertMessage('Error sending message!');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
    }
  
    setNewMessage('');
  };  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl rounded-lg overflow-hidden min-w-[900px]">
      <div className="flex justify-between items-center p-4 bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-gray-700">
        <h1 className="text-2xl font-bold text-white">Tech Talk</h1>
        <Link href="/">
          <IconButton color="inherit">
            <ExitToApp className="text-white transition-transform transform hover:scale-110" />
          </IconButton>
        </Link>
      </div>

      <div
        className="flex-grow overflow-y-auto p-4 bg-black/30 backdrop-blur-lg rounded-lg transition-all duration-300 ease-in-out"
        onScroll={() => setIsUserScrolling(true)}
        onMouseEnter={() => setIsUserScrolling(false)}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`} key={message.id}>
              <Card className={`shadow-lg rounded-lg border-0 max-w-[75%] transition-transform duration-200 ease-in-out hover:scale-105 ${message.user_id === userId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                <CardContent className="p-3">
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
                      <span className="text-white font-semibold hover:text-blue-400 transition-colors duration-200">{message.username}</span>
                    </Link>
                    <span className="text-gray-300 text-xs">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg text-white transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
                    {message.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-gray-800 shadow-lg rounded-lg flex items-center">
        <Input
          type="text"
          placeholder="Type your message..."
          className="mr-2 mb-2 md:mb-0 md:flex-grow bg-gray-900 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 hover:bg-gray-800"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCooldown} // Disable input during cooldown
        />
        <Button 
          className="transition-transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
          onClick={handleSendMessage}
          disabled={isCooldown} // Disable button during cooldown
        >
          {isCooldown ? 'Wait...' : 'Send'}
        </Button>
      </div>

      {alertOpen && (
        <div className="absolute bottom-5 right-5 z-50">
          <Alert severity={alertMessage.includes('Error') ? 'error' : 'success'} onClose={() => setAlertOpen(false)} className="transition-all duration-200 transform">
            {alertMessage}
          </Alert>
        </div>
      )}
    </div>
  );
}