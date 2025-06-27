import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { auth } from '@/auth'; // This is your NextAuth handler (from auth.ts or auth.js)
import { authConfig } from '@/auth.config';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: NextRequest) {
  try {
    const { challengeId, part, answer } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    console.log('Received data:', { challengeId, part, answer, userId });

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!challengeId || !part || !answer) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    console.log('Get data');

    const challenge = await sql`
      SELECT * FROM challenges
      WHERE challenge_number = ${challengeId}
    `;

    if (!challenge[0]?.id) {
        return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }
    const challengeDbId = challenge[0].id;
    console.log('Challenge data:', challengeDbId);

    // Check if a row already exists for this user/challenge
    const existing = await sql`
      SELECT * FROM user_answers
      WHERE user_id = ${userId}::uuid AND challenge_id = ${challengeDbId}::uuid`;

    console.log('Existing answers:', existing);

    const now = new Date();
    let answer1Correct = false;
    let answer2Correct = false;
    answer1Correct = part === 1 && answer === challenge[0].answer1;
    answer2Correct = part === 2 && answer === challenge[0].answer2;

    if (existing.length === 0) {
      // Insert new row
      if (part === 1) {
        await sql`
          INSERT INTO user_answers (user_id, challenge_id, answer1, answer1_date)
          VALUES (${userId}, ${challengeDbId}, ${answer}, ${now})
        `;
      } else {
        // Can't submit part 2 before part 1
        return NextResponse.json({ error: 'Submit part 1 first.' }, { status: 400 });
      }
    } else {
      // Update existing row
      if (part === 1) {
        await sql`
          UPDATE user_answers
          SET answer1 = ${answer}, answer1_date = ${now}
          WHERE user_id = ${userId} AND challenge_id = ${challengeDbId}
        `;
      } else if (part === 2) {
        await sql`
          UPDATE user_answers
          SET answer2 = ${answer}, answer2_date = ${now}
          WHERE user_id = ${userId} AND challenge_id = ${challengeDbId}
        `;
      }
    }

    return NextResponse.json({ success: true, answer1Correct, answer2Correct }, { status: 200 });
  } catch (error) {
    console.log('Error submitting answer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}