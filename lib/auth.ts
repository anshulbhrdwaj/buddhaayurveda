import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import dbConnect from './dbConnect';
import UserModel from './models/UserModel';

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials === null) return null;

        const user = await UserModel.findOne({ email: credentials.email });

        if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );
          if (isMatch) {
            return user;
          }
        } else if (user && !user.password) {
          return user;
        }
        return null;
      },
    }),
  ],
  // custom pages for sign in and register
  pages: {
    signIn: '/store/signin',
    newUser: '/store/register',
    error: '/store/error',
  },
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name || user.fullName,
          contact: user.contact,
          isAdmin: user.isAdmin,
        };
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          contact: session.user.contact,
          name: session.user.name || session.user.fullName,
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
