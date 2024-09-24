import { NextResponse } from "next/server"
import { db } from "@/db/db"
import { users } from "@/db/schema"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
    }).returning()

    return NextResponse.json({ user: { id: newUser.id, name: newUser.name, email: newUser.email } })
  } catch (error) {
    console.error("Sign up failed", error)
    return NextResponse.json({ error: "Sign up failed" }, { status: 500 })
  }
}