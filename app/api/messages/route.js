import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export async function POST(request) {
 try {
  const body=await request.json(); const message=typeof body.message==="string"?body.message.trim():"";
  if(message.length<1||message.length>1500) return NextResponse.json({error:"Messages must be between 1 and 1500 characters."},{status:400});
  if(!process.env.DATABASE_URL) return NextResponse.json({error:"The inbox is still being connected. Please try again later."},{status:503});
  const sql=neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS anonymous_messages (id BIGSERIAL PRIMARY KEY, message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1500), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), reviewed BOOLEAN NOT NULL DEFAULT FALSE)`;
  await sql`INSERT INTO anonymous_messages (message) VALUES (${message})`;
  return NextResponse.json({ok:true});
 } catch(e) { return NextResponse.json({error:"Message could not be saved right now."},{status:500}); }
}
