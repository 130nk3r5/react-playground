import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface Challenge {
  id: string;
  answer1: string;
  answer2: string;
}

interface UserAnswer {
  id: string;
  user_id: string;
  challenge_id: string;
  answer1: string | null;
  answer1_date: string | null;
  answer2: string | null;
  answer2_date: string | null;
}

interface AnswerDate {
  user_id: string;
  date: Date;
}

export async function GET() {
  try {
    // Get all users, challenges, and user_answers in one go
    const users = await sql<User[]>`SELECT id, name, email FROM users`;
    const challenges = await sql<Challenge[]>`SELECT * FROM challenges`;
    const userAnswers = await sql<UserAnswer[]>`SELECT * FROM user_answers`;

    // Build a map for quick lookup
    const answersByUserAndChallenge = new Map<string, UserAnswer>();
    for (const ans of userAnswers) {
      answersByUserAndChallenge.set(`${ans.user_id}_${ans.challenge_id}`, ans);
    }

    // For each challenge, precompute sorted answer1/answer2 dates for all users
    const challengeAnswer1Dates = new Map<string, AnswerDate[]>();
    const challengeAnswer2Dates = new Map<string, AnswerDate[]>();
    for (const challenge of challenges) {
      const cId = challenge.id;
      const a1Dates: AnswerDate[] = userAnswers
        .filter((a) => a.challenge_id === cId && a.answer1 && a.answer1_date)
        .map((a) => ({ user_id: a.user_id, date: new Date(a.answer1_date as string) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      challengeAnswer1Dates.set(cId, a1Dates);
      const a2Dates: AnswerDate[] = userAnswers
        .filter((a) => a.challenge_id === cId && a.answer2 && a.answer2_date)
        .map((a) => ({ user_id: a.user_id, date: new Date(a.answer2_date as string) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      challengeAnswer2Dates.set(cId, a2Dates);
    }

    const userScores = users.map(user => {
      let score = 0;
      for (const challenge of challenges) {
        const challengeId = challenge.id;
        const ans = answersByUserAndChallenge.get(`${user.id}_${challengeId}`);
        if (!ans) continue;
        // answer1
        let answer1Points = 0;
        if (ans.answer1 === challenge.answer1) {
          answer1Points = 50;
          if (ans.answer1_date) {
            const a1Dates = challengeAnswer1Dates.get(challengeId) || [];
            const idx = a1Dates.findIndex((a) => a.user_id === user.id);
            answer1Points -= 5 * idx;
          }
        }
        // answer2
        let answer2Points = 0;
        if (ans.answer2 === challenge.answer2) {
          answer2Points = 50;
          if (ans.answer2_date) {
            const a2Dates = challengeAnswer2Dates.get(challengeId) || [];
            const idx = a2Dates.findIndex((a) => a.user_id === user.id);
            answer2Points -= 5 * idx;
          }
        }
        score += Math.max(answer1Points, 0);
        score += Math.max(answer2Points, 0);
      }
      return {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        score,
      };
    });
    userScores.sort((a, b) => b.score - a.score);
    return NextResponse.json({ users: userScores });
  } catch (error) {
    console.error('Error fetching all scores:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
