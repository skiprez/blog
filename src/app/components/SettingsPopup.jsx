"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function SettingsPopup({ isOpen, onClose, currentUsername, onUpdateUsername }) {
  const [username, setUsername] = useState(currentUsername);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const handleUpdate = () => {
    onUpdateUsername(username, profilePictureUrl);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 p-5 rounded-lg">
          <h2 className="text-white font-semibold">Settings</h2>
          <div className="mt-4">
            <label className="text-white">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 rounded"
            />
          </div>
          <div className="mt-4">
            <label className="text-white">Profile Picture URL:</label>
            <input
              type="text"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              className="w-full p-2 mt-1 rounded"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose} className="mr-2">Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </div>
        </div>
      </div>
    )
  );
}