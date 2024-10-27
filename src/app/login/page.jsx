"use client";

import { useState } from 'react';
import { motion } from 'framer-motion'; // Importing Framer Motion
import Link from 'next/link';
import { Button } from '../components/ui/button.jsx'; // Adjust the import according to your project structure

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/Auth/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 px-4 md:mt-40 mt-20 rounded-lg md:min-w-[500px]">
      <motion.div
        className="max-w-sm w-full bg-gray-800 p-8 rounded-lg shadow-2xl transition-transform duration-300 transform hover:scale-105"
        initial={{ opacity: 0, y: -20 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }}    // Final animation state
        transition={{ duration: 0.5 }}     // Animation duration
      >
        <h1 className="text-white text-3xl font-bold text-center mb-6">Welcome Back</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ scale: 1 }} // Initial scale state
            whileHover={{ scale: 1.02 }} // Scale effect on hover
            transition={{ duration: 0.3 }} // Animation duration
          >
            <label className="block text-gray-300 mb-1" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Enter your username"
            />
          </motion.div>
          <motion.div
            initial={{ scale: 1 }} // Initial scale state
            whileHover={{ scale: 1.02 }} // Scale effect on hover
            transition={{ duration: 0.3 }} // Animation duration
          >
            <label className="block text-gray-300 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Enter your password"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }} // Slightly increase scale on hover
            transition={{ duration: 0.3 }}
          >
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 transition duration-150">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </motion.div>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don&apos;t have an account? <Link href="/register" className="text-blue-400 hover:underline">Register here</Link>
        </p>
      </motion.div>
    </main>
  );
}
