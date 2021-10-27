import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  adapter: PrismaAdapter(prisma),
  session: {
    jwt: false,
    maxAge: 30 * 60 * 60 * 24, // 30 days
    updateAge: 10 * 60 * 60 * 24, // every 10 days, extend session by 30 days
  },
  database: process.env.DATABASE_URL,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn: ', user, account, profile, email, credentials);
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('redirect: ', url, baseUrl);
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log('session: ', session, user, token);
      session.token = token;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('jwt: ', token, user, account, profile, isNewUser);
      return token;
    },
  },
});
