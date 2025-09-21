import { NextResponse } from "next/server";
import clientPromise from "../../api/auth/[...nextauth]/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const body = await request.json();
  const { name, email, password, phone } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // 기본 DB 사용
    const users = db.collection("manual_users");

    // 이메일 중복 체크
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    // 비밀번호는 반드시 hash
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ name, email, password: hashedPassword, phone, createdAt: new Date() });

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}