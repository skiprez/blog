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
  }, []);

  const onSubmit = async (data) => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

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
      console.log('Post created successfully!');
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
    <div className="mt-3 ml-[65px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] md:w-[500px] mb-6 md:mt-[-20px]">
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
                    onKeyDown={handleKeyDown} // Attach the key down handler here
                  />
                </FormControl>
                <FormDescription>
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
                <div className="absolute mt-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <Button type="submit" className="w-[100px] md:w-[100px] mt-2">Post</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}