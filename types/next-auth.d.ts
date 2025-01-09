import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string | null;
      contact?: string | null;
      isAdmin?: boolean;
      fullName?: string | null;
    } & DefaultSession['user'];
  }

  export interface User extends DefaultUser {
    _id?: string;
    isAdmin?: boolean;
    contact?: string;
  }
}
