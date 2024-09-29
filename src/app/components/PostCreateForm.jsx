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

  const onSubmit = async (data) => {
    const response = await fetch('/api/CreatePost', {
        method: 'POST',
        body: JSON.stringify({ post: data.post }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const newPost = await response.json();
        onAddPost(newPost); // Call the function passed down from Home
        form.reset(); // Reset form after submission
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

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] mb-6 mt-[-20px]">
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-md">Create Post</FormLabel>
                <FormControl>
                  <Textarea placeholder="What happened today..." {...field} />
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

              <Button type="submit" className="w-[100px] mt-2">Post</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}