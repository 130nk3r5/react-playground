import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
  
    const challenges = await sql`
      SELECT * FROM challenges
    `;
    let score = 0;
    
    for (const challenge of challenges) {
      const challengeId = challenge.id;
      const existing = await sql`
        SELECT answer1, answer1_date, answer2, answer2_date FROM user_answers
        WHERE user_id = ${userId}::uuid AND challenge_id = ${challengeId}::uuid
      `;
      if (existing.length === 0) {
        continue; // No answers submitted for this challenge
      }

      // Check answer1
      let answer1Points = 0;
      if (existing[0].answer1 === challenge.answer1) {
        answer1Points = 50;
        if (existing[0].answer1_date) {
          const countBefore = await sql`
            SELECT COUNT(*) FROM user_answers
            WHERE challenge_id = ${challengeId}::uuid
              AND answer1 IS NOT NULL
              AND answer1_date < ${existing[0].answer1_date}
          `;
          answer1Points -= 5 * Number(countBefore[0].count);
        }
      }

      // Check answer2
      let answer2Points = 0;
      if (existing[0].answer2 === challenge.answer2) {
        answer2Points = 50;
        if (existing[0].answer2_date) {
          const countBefore = await sql`
            SELECT COUNT(*) FROM user_answers
            WHERE challenge_id = ${challengeId}::uuid
              AND answer2 IS NOT NULL
              AND answer2_date < ${existing[0].answer2_date}
          `;
          answer2Points -= 5 * Number(countBefore[0].count);
        }
      }

      score += Math.max(answer1Points, 0);
      score += Math.max(answer2Points, 0);
    }

    return NextResponse.json({ score: score });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
