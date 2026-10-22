import { NextResponse } from "next/server";
export async function POST(request) {
 const {password}=await request.json();
 if(!process.env.ADMIN_PASSWORD || password!==process.env.ADMIN_PASSWORD) return NextResponse.json({error:"Invalid password."},{status:401});
 const response=NextResponse.json({ok:true});
 response.cookies.set("emp_unknown_admin","authenticated",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*8});
 return response;
}
