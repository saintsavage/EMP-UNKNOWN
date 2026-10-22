import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export async function GET(request) {
 if(request.cookies.get("emp_unknown_admin")?.value!=="authenticated" || !process.env.ADMIN_PASSWORD) return NextResponse.json({error:"Unauthorized."},{status:401});
 if(!process.env.DATABASE_URL) return NextResponse.json({error:"Database is not configured."},{status:503});
 const sql=neon(process.env.DATABASE_URL);
 await sql`CREATE TABLE IF NOT EXISTS anonymous_messages (id BIGSERIAL PRIMARY KEY, message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1500), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), reviewed BOOLEAN NOT NULL DEFAULT FALSE)`;
 const rows=await sql`SELECT id, message, created_at, reviewed FROM anonymous_messages ORDER BY created_at DESC LIMIT 200`;
 return NextResponse.json({messages:rows});
}
export async function DELETE(request) {
 if(request.cookies.get("emp_unknown_admin")?.value!=="authenticated" || !process.env.ADMIN_PASSWORD) return NextResponse.json({error:"Unauthorized."},{status:401});
 if(!process.env.DATABASE_URL) return NextResponse.json({error:"Database is not configured."},{status:503});
 const body=await request.json(); const id=Number(body.id);
 if(!Number.isSafeInteger(id)||id<1) return NextResponse.json({error:"Invalid message id."},{status:400});
 const sql=neon(process.env.DATABASE_URL); await sql`DELETE FROM anonymous_messages WHERE id = ${id}`;
 return NextResponse.json({ok:true});
}
