"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EmojiPicker from "emoji-picker-react";

import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
import { Input } from "../components/ui/input";

const formSchema = z.object({
  post: z.string().min(3, {
    message: "Post must be at least 3 characters.",
  }),
});

export default function PostForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('post', data.post);

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    console.log('Form Data:', formData);
  };

  const handleEmojiClick = (emojiObject) => {
    const currentValue = form.getValues("post");
    form.setValue("post", currentValue + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
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

                {selectedFile && (
                    <div className="mt-2 text-sm text-white">
                        Selected file: {selectedFile.name}
                    </div>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-between">
            <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={handleFileChange}
                />

                {selectedFile ? (
                  <Button variant="icon" size="icon" type="button" onClick={removeSelectedFile}>
                    <DeleteOutlineOutlinedIcon className="text-red-500" />
                  </Button>
                ) : (
                  <Button variant="icon" size="icon" type="button" onClick={() => document.getElementById('fileInput').click()}>
                    <AttachFileOutlinedIcon className="text-blue-500" />
                  </Button>
                )}

                <Button variant="icon" size="icon" type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <EmojiEmotionsOutlinedIcon className="text-blue-500" />
                </Button>

                {showEmojiPicker && (
                  <div className="absolute mt-2">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
            </div>

            <Button type="submit" className="w-[100px] mt-2">Post</Button>
        </div>
      </form>
    </Form>
  );
}