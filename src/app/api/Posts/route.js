import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export async function GET() {
    const res = await client.query('SELECT * FROM messages ORDER BY created_at ASC');
    return NextResponse.json(res.rows);
}