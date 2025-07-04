import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

export async function createUser(email: string, password: string): Promise<true | string> {
  // Check if user already exists
  const existing = await sql`
    SELECT id FROM users WHERE email = ${email}
  `;
  if (existing.length > 0) {
    return 'A user with this email already exists.';
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  try {
    await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, ${email})
    `;
    return true;
  } catch (error) {
    return 'Failed to create user.';
  }
}