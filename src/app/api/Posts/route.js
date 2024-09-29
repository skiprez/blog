import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.POSTGRES_URL,
});

client.connect();

export async function GET() {
    const res = await client.query('SELECT * FROM posts ORDER BY shares DESC');
    return NextResponse.json(res.rows);
}