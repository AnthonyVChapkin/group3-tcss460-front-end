// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project import
import axios from 'utils/axios';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPhoneNumber() {
  const areaCode = getRandomInt(100, 999);
  const centralOfficeCode = getRandomInt(100, 999);
  const lineNumber = getRandomInt(1000, 9999);
  return `${areaCode}-${centralOfficeCode}-${lineNumber}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email:    { label: 'Email',    type: 'email',    placeholder: 'Enter email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter password' }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post('/login', {
            email:    credentials?.email,
            password: credentials?.password
          });
          const user = res.data.user;
          user.accessToken = res.data.accessToken;
          return user;
        } catch (err: any) {
          const msg =
            err.response?.data?.message ||
            err.message ||
            'Login failed';
          throw new Error(msg);
        }
      }
    }),

    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        firstname: { label: 'First Name', type: 'text',     placeholder: 'Enter first name' },
        lastname:  { label: 'Last Name',  type: 'text',     placeholder: 'Enter last name' },
        email:     { label: 'Email',      type: 'email',    placeholder: 'Enter email' },
        username:  { label: 'Username',   type: 'text',     placeholder: 'Choose a username' },
        password:  { label: 'Password',   type: 'password', placeholder: 'Enter password' },
        role:      { label: 'Role',       type: 'number',   placeholder: '1–5' },
        phone:     { label: 'Phone',      type: 'text',     placeholder: '415-555-1212' }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post('/register', {
            firstname: credentials?.firstname,
            lastname:  credentials?.lastname,
            email:     credentials?.email,
            username:  credentials?.username,
            password:  credentials?.password,
            role:      Number(credentials?.role),
            phone:     credentials?.phone
          });
          const user = res.data.user;
          user.accessToken = res.data.accessToken;
          return user;
        } catch (err: any) {
          const msg =
            err.response?.data?.message ||
            err.message ||
            'Registration failed';
          throw new Error(msg);
        }
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.id          = user.id;
        token.provider    = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.id       = token.id as any;
      session.provider = token.provider as any;
      session.token    = token as any;
      return session;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge:   Number(process.env.REACT_APP_JWT_TIMEOUT)
  },

  jwt: {
    secret: process.env.REACT_APP_JWT_SECRET
  },

  pages: {
    signIn:  '/login',
    newUser: '/register'
  }
};
