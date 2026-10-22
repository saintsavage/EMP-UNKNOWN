import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function authorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    request.cookies.get("emp_unknown_admin")?.value === "authenticated";
}

export async function GET(request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured. Add DATABASE_URL in Vercel Environment Variables." }, { status: 503 });

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS anonymous_messages (
      id BIGSERIAL PRIMARY KEY,
      message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1500),
      category TEXT NOT NULL DEFAULT 'general',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reviewed BOOLEAN NOT NULL DEFAULT FALSE
    )`;
    await sql`ALTER TABLE anonymous_messages ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general'`;
    const rows = await sql`SELECT id, message, category, created_at, reviewed FROM anonymous_messages ORDER BY created_at DESC LIMIT 200`;
    return NextResponse.json({ messages: rows });
  } catch {
    return NextResponse.json({ error: "Could not read the inbox database. Check the DATABASE_URL connection in Vercel." }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });

  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
    const sql = neon(process.env.DATABASE_URL);
    await sql`DELETE FROM anonymous_messages WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete the message. Please try again." }, { status: 500 });
  }
}
