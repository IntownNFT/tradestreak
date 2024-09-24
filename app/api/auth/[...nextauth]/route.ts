import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/db/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize function called with credentials:", credentials)

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        try {
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)
          console.log("User query result:", user)

          if (user.length === 0) {
            console.log("No user found with the provided email")
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user[0].passwordHash)
          console.log("Password validation result:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("Authentication successful")
          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
          }
        } catch (error) {
          console.error("Error in authorize function:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true, // Enable debug messages
})

export { handler as GET, handler as POST }