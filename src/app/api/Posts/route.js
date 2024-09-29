import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.POSTGRES_URL,
});
  
client.connect();

export async function GET() {
    const res = await client.query('SELECT * FROM messages ORDER BY created_at ASC');
    return NextResponse.json(res.rows);
}