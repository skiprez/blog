'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './../components/ui/button.jsx';
import { Input } from './../components/ui/input.jsx';
import { Card, CardContent } from "./../components/ui/card.jsx";
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import { ExitToApp } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import account_icon from './../../public/account_icon.png';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const lastMessageRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem('userId');

    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem('userId', storedUserId);
    }

    setUserId(storedUserId);

    async function fetchMessages() {
      try {
        const response = await fetch('/api/Messages');
        const data = await response.json();
        console.log('Fetched Messages:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const newMessageData = { user_id: userId, content: newMessage };
    setMessages((prev) => [...prev, { ...newMessageData, id: uuidv4(), created_at: new Date() }]);

    try {
      const response = await fetch('/api/Messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessageData),
      });

      const savedMessage = await response.json();
      console.log('Saved Message:', savedMessage);
      
      // Show alert on successful send
      setAlertMessage('Message sent successfully!');
      setAlertOpen(true);

      // Optionally hide alert after 3 seconds
      setTimeout(() => setAlertOpen(false), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setAlertMessage('Error sending message!');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
    }

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-center text-2xl font-bold text-white">
          Chat of All Users
        </h1>
        <Link href="/">
          <IconButton color="inherit">
            <ExitToApp className="text-white"/>
          </IconButton>
        </Link>
      </div>

      {/* Message List */}
      <div
        className="flex-grow overflow-y-auto p-4 backdrop-filter backdrop-blur-lg bg-black/30 rounded-lg"
        onScroll={() => setIsUserScrolling(true)}
        onMouseEnter={() => setIsUserScrolling(false)}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'} fade-in`} key={message.id}>
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
                      <span className="text-white font-semibold">{message.user_id}</span>
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
          />
          <Button className="transition-transform hover:scale-105" onClick={handleSendMessage}>Send</Button>
        </div>
      </div>

      {/* Alert for message sending in the bottom right corner */}
      {alertOpen && (
        <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }} className="slide-in">
          <Alert severity="success" onClose={() => setAlertOpen(false)}>
            {alertMessage}
          </Alert>
        </div>
      )}
    </div>
  );
}