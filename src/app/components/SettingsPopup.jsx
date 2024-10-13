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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Profile Picture URL:</label>
            <input
              type="text"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the URL for your profile picture"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose} className="mr-2 text-gray-400 hover:bg-gray-700">Cancel</Button>
            <Button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600">Save</Button>
          </div>
        </div>
      </div>
    )
  );
}