import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users, quotes } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedQuotes() {
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedQuotes = await Promise.all(
    quotes.map(
      (quote) => sql`
        INSERT INTO quotes (customer_id, amount, status, date)
        VALUES (${quote.customer_id}, ${quote.amount}, ${quote.status}, ${quote.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedQuotes;
}

async function seedChallenges() {
  await sql`
      CREATE TABLE IF NOT EXISTS challenges (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        challenge_number INT NOT NULL,
        challenge text NOT NULL,
        answer1 VARCHAR(255) NOT NULL,
        answer2 VARCHAR(255) NOT NULL
      );
    `;

  //  const insertedChallenges = await Promise.all(
  //   challenges.map(
  //     (challenge) => sql`
  //       INSERT INTO challenges (id, challenge_number, challenge, answer1, answer2)
  //       VALUES (${challenge.id}, ${challenge.challenge_number}, ${challenge.challenge}, ${challenge.answer1}, ${challenge.answer2})
  //       ON CONFLICT (id) DO NOTHING;
  //     `,
  //   ),
  // );

  // return insertedChallenges;
}

async function createUserAnswers() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_answers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      challenge_id UUID NOT NULL,
      answer1 text NULL,
      answer1_date TIMESTAMP NULL,
      answer2 text NULL,
      answer2_date TIMESTAMP NULL
    );
  `;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await sql.begin(() => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
      seedQuotes(),
      seedChallenges(),
      createUserAnswers()
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
