import { NextResponse } from "next/server";
import function POST(req) {
    console.log(req)
    return NextResponse.json({message: "hello, this is from server"})
}