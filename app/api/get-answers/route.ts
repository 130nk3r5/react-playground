import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!challengeId) {
      return NextResponse.json({ error: 'Missing challengeId' }, { status: 400 });
    }

    const challenge = await sql`
      SELECT * FROM challenges WHERE challenge_number = ${challengeId}
    `;
    if (!challenge[0]?.id) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }
    const challengeDbId = challenge[0].id;

    const existing = await sql`
      SELECT answer1, answer2 FROM user_answers
      WHERE user_id = ${userId}::uuid AND challenge_id = ${challengeDbId}::uuid
    `;
    if (existing.length === 0) {
      return NextResponse.json({ answer1: null, answer2: null, answer1Correct: false, answer2Correct: false });
    }
    // Check correctness
    const answer1Correct = existing[0].answer1 === challenge[0].answer1;
    const answer2Correct = existing[0].answer2 === challenge[0].answer2;
    return NextResponse.json({ answer1: existing[0].answer1, answer2: existing[0].answer2, answer1Correct, answer2Correct });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
