"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EmojiPicker from "emoji-picker-react";

import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form.jsx";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { motion } from 'framer-motion';

const formSchema = z.object({
  post: z.string().min(3, { message: "Post must be at least 3 characters." }),
});

export default function PostForm({ onAddPost }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // To track remaining time in seconds

  useEffect(() => {
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

    // Check if user has a cooldown
    const lastPostTime = localStorage.getItem(`lastPostTime_${userId}`);
    if (lastPostTime) {
      const currentTime = Date.now();
      const timeDifference = currentTime - parseInt(lastPostTime);

      if (timeDifference < 180000) {  // 180,000ms = 3 minutes
        const remainingMs = 180000 - timeDifference;
        setCooldown(true);
        setRemainingTime(Math.ceil(remainingMs / 1000)); // Convert to seconds

        // Start a timer to count down
        const interval = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(interval); // Stop the timer when cooldown is done
              setCooldown(false); // Reset the cooldown
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => clearInterval(interval); // Clean up the timer on component unmount
      }
    }
  }, [userId]);

  const onSubmit = async (data) => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    // Check for cooldown before submitting
    const lastPostTime = localStorage.getItem(`lastPostTime_${userId}`);
    const currentTime = Date.now();

    if (lastPostTime && (currentTime - parseInt(lastPostTime)) < 180000) {
      console.error('You must wait 3 minutes before posting again.');
      return;
    }

    // Proceed with submission if no cooldown
    const response = await fetch('/api/Posts', {
      method: 'POST',
      body: JSON.stringify({ post: data.post, userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const newPost = await response.json();
      onAddPost(newPost);
      form.reset();

      // Set new cooldown timer in localStorage
      localStorage.setItem(`lastPostTime_${userId}`, currentTime.toString());

      // Trigger cooldown state and set timer
      setCooldown(true);
      setRemainingTime(180); // 3 minutes = 180 seconds

      // Start a timer to count down
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval); // Stop the timer when cooldown is done
            setCooldown(false); // Reset the cooldown
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

    } else {
      console.error('Failed to create post:', await response.json());
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const currentValue = form.getValues("post");
    form.setValue("post", currentValue + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <motion.div 
      className="mt-3 bg-gray-800 rounded-lg shadow-lg p-4 min-w-[600px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mb-6">
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-md">Create Post</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What happened today..."
                    {...field}
                    onKeyDown={handleKeyDown}
                    className="bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  This will be public if you post this.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center justify-between">
            <Button variant="icon" size="icon" type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotionsOutlinedIcon className="text-blue-500" />
            </Button>

            {showEmojiPicker && (
              <div className="absolute mt-[415px] ml-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-[100px] mt-2 ${cooldown ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-all duration-300`}
              disabled={cooldown} // Disable button during cooldown
            >
              {cooldown ? `Wait ${remainingTime}s` : 'Post'} {/* Show cooldown time or "Post" */}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}