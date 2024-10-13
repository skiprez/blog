"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button.jsx';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/Auth/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Handle successful registration (e.g., redirect to login page)
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center max-w-full px-4 md:w-[400px] mx-auto">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">Register</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <p className="text-white text-center mt-4">
        Already have an account? <Link href="/login" className="text-blue-400">Login here</Link>
      </p>
    </main>
  );
}
