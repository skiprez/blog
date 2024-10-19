// components/SettingsModal.js
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const SettingsModal = ({ open, handleClose, user, handleEditUser }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSave = async () => {
    // Call the handleEditUser with the updated user data
    await handleEditUser({ ...user, username });
    handleClose(); // Close the modal after saving
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" className="font-semibold text-gray-800 mb-2">
          Settings for {user.username}
        </Typography>
        <Typography className="text-gray-600 mb-4">
          Here you can update the settings for this user.
        </Typography>

        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="contained" color="primary" onClick={handleSave} className="mr-2">
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SettingsModal;