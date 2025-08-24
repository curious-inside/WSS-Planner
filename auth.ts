import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

const client = new MongoClient(process.env.MONGODB_URI!)

export const config = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Auth attempt with email:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          throw new Error('Invalid credentials')
        }

        await dbConnect()
        console.log('DB connected')

        const user = await User.findOne({ email: credentials.email }).select('+password')
        console.log('User found:', !!user)

        if (!user) {
          console.log('User not found')
          throw new Error('Invalid credentials')
        }

        const passwordMatch = await user.comparePassword(credentials.password)
        console.log('Password match:', passwordMatch)

        if (!passwordMatch) {
          console.log('Password mismatch')
          throw new Error('Invalid credentials')
        }

        console.log('Auth successful for:', user.email)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        await dbConnect()
        
        const existingUser = await User.findOne({ email: user.email })
        
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            avatar: user.image,
            role: 'developer',
            password: Math.random().toString(36), // Random password for OAuth users
          })
        }
      }
      
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)