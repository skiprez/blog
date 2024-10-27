'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { Button } from '../components/ui/button.jsx';

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const PatchNotes = () => {
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      const res = await fetch('/api/Git');
      if (!res.ok) {
        setError('Failed to load commits');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCommits(data);
      setLoading(false);
    };

    fetchCommits();
  }, []);

  if (loading) {
    return <CircularProgress className="mt-[450px]" />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box maxWidth="sm" mx="auto" p={2} className="bg-gray-900 max-h-[700px] md:max-h-screen md:h-screen">
      <div className="flex justify-between items-center">
        <Typography variant="h4" gutterBottom className="text-white">
          Patch Notes
        </Typography>
        <Button variant="icon" className="text-gray-400 hover:text-blue-500 h-[40px] w-[40px]">
          <Link href='/' >
            <LogoutOutlinedIcon />
          </Link>
        </Button>
      </div>
      <Typography variant="subtitle1" className="text-gray-400">
        Latest changes to the codebase.
      </Typography>
      <Box
        className="md:h-[878px]"
        sx={{
          height: 590,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 2,
        }}
      >
        {commits.map(commit => (
          <Card key={commit.sha} sx={{ mb: 2 }} className="bg-gray-800">
            <CardContent>
              <Typography variant="h6" className="font-bold text-gray-50">{commit.commit.message}</Typography>
              <Typography color="textSecondary" className="text-gray-300">
                by {commit.commit.author.name} on {new Date(commit.commit.author.date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PatchNotes;