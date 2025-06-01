// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project import
import axios from 'axios';

// Create a simple axios instance for auth calls (without interceptors to avoid circular dependency)
const authAxios = axios.create({
  baseURL: process.env.WEB_API_URL || 'https://group9-tcss460-web-api-84fb72a7d497.herokuapp.com'
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter password' }
      },
      async authorize(credentials) {
        try {
          console.log('Attempting login with email:', credentials?.email);

          const res = await authAxios.post('/login', {
            email: credentials?.email,
            password: credentials?.password
          });

          console.log('Login response:', res.data);

          if (res.data && res.data.accessToken && res.data.user) {
            // Return the user object with the access token
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
              role: res.data.user.role,
              accessToken: res.data.accessToken // Store the access token
            };
          }

          throw new Error('Invalid response from server');
        } catch (err: any) {
          console.error('Login error:', err.response?.data || err.message);
          const msg = err.response?.data?.message || err.message || 'Login failed';
          throw new Error(msg);
        }
      }
    }),

    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        firstname: { label: 'First Name', type: 'text', placeholder: 'Enter first name' },
        lastname: { label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
        email: { label: 'Email', type: 'email', placeholder: 'Enter email' },
        username: { label: 'Username', type: 'text', placeholder: 'Choose a username' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter password' },
        role: { label: 'Role', type: 'number', placeholder: '1–5' },
        phone: { label: 'Phone', type: 'text', placeholder: '415-555-1212' }
      },
      async authorize(credentials) {
        try {
          console.log('Attempting registration with email:', credentials?.email);

          const res = await authAxios.post('/register', {
            firstname: credentials?.firstname,
            lastname: credentials?.lastname,
            email: credentials?.email,
            username: credentials?.username,
            password: credentials?.password,
            role: Number(credentials?.role),
            phone: credentials?.phone
          });

          console.log('Registration response:', res.data);

          if (res.data && res.data.accessToken && res.data.user) {
            // Return the user object with the access token
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
              role: res.data.user.role,
              accessToken: res.data.accessToken // Store the access token
            };
          }

          throw new Error('Invalid response from server');
        } catch (err: any) {
          console.error('Registration error:', err.response?.data || err.message);
          const msg = err.response?.data?.message || err.message || 'Registration failed';
          throw new Error(msg);
        }
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user, account }) => {
      // If this is the first time (user object exists), store the access token
      if (user) {
        console.log('Storing access token in JWT:', user);
        token.id = user.id;
        token.accessToken = (user as any).accessToken; // Store the access token from login/register
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      // Pass the access token to the session
      session.id = token.id as any;
      session.provider = token.provider as any;
      session.token = {
        ...token,
        accessToken: token.accessToken // Make sure accessToken is available in session
      } as any;

      console.log('Session created with access token:', !!session.token.accessToken);
      return session;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.REACT_APP_JWT_TIMEOUT) || 86400
  },

  jwt: {
    secret: process.env.REACT_APP_JWT_SECRET
  },

  pages: {
    signIn: '/login',
    newUser: '/register'
  },

  debug: process.env.NODE_ENV === 'development' // Enable debug logs in development
};
