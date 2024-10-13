import { NextResponse } from 'next/server';

export async function POST(req) {
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.delete('session'); // Clear the session cookie
    return response;
  }
  