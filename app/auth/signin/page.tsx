"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    console.log(result) // Add this line to log the result

    if (result?.ok) {
      router.push("/")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Card className="w-[350px] bg-[#141414] border-[#141414]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-[rgba(191,219,254,1)]">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="bg-[#1f1f1f] text-[rgba(229,231,235,1)] border-[rgba(191,219,254,0.5)]"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="bg-[#1f1f1f] text-[rgba(229,231,235,1)] border-[rgba(191,219,254,0.5)]"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[rgba(156,163,175,1)]">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[rgba(191,219,254,1)] hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}