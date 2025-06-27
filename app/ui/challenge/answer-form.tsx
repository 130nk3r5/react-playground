'use client';

import React, { useState, useEffect } from "react";

export default function AnswerForm({ challengeId }: { challengeId: string }) {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [answer1Correct, setAnswer1Correct] = useState(false);
  const [answer2Correct, setAnswer2Correct] = useState(false);

  async function handleSubmit1(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify({ challengeId, part: 1, answer: answer1 }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(data.answer1Correct ? "Part 1 correct!" : "Part 1 submitted, but not correct.");
      setAnswer1Correct(data.answer1Correct);
      fetchAnswers();
    } else {
      setMessage("Failed to submit Part 1.");
    }
  }

  async function handleSubmit2(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify({ challengeId, part: 2, answer: answer2 }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(data.answer2Correct ? "Part 2 correct! 🎉" : "Part 2 submitted, but not correct.");
      setAnswer2Correct(data.answer2Correct);
      fetchAnswers();
    } else {
      setMessage("Failed to submit Part 2.");
    }
  }

  async function fetchAnswers() {
    const res = await fetch(`/api/get-answers?challengeId=${challengeId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.answer1 !== undefined && data.answer1 !== null) {
        setAnswer1(data.answer1);
      }
      if (data.answer2 !== undefined && data.answer2 !== null) {
        setAnswer2(data.answer2);
      }
      setAnswer1Correct(!!data.answer1Correct);
      setAnswer2Correct(!!data.answer2Correct);
    }
  }

  async function fetchScore() {
    const res = await fetch(`/api/get-score`);
    if (res.ok) {
      const data = await res.json();
      if (data.score !== undefined && data.score !== null) {
        setScore(data.score);
      }
    }
  }

  useEffect(() => {
    fetchAnswers();
    fetchScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId]);

  return (
    <section className="mb-8">
      <h3>Current Score: {score}</h3>
      <h3 className="font-bold mb-2">Submit or update your answers</h3>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit1} className="flex flex-col gap-2 mb-4">
        <label htmlFor="answer1">Part 1 Answer:</label>
        <input
          id="answer1"
          type="text"
          value={answer1}
          onChange={e => setAnswer1(e.target.value)}
          className="border rounded px-2 py-1"
          required
          disabled={answer1Correct}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          disabled={answer1Correct}
        >
          {answer1Correct ? "Locked (Correct)" : "Submit/Update Part 1"}
        </button>
      </form>
      <form onSubmit={handleSubmit2} className="flex flex-col gap-2">
        <label htmlFor="answer2">Part 2 Answer:</label>
        <input
          id="answer2"
          type="text"
          value={answer2}
          onChange={e => setAnswer2(e.target.value)}
          className="border rounded px-2 py-1"
          required
          disabled={answer2Correct}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          disabled={answer2Correct}
        >
          {answer2Correct ? "Locked (Correct)" : "Submit/Update Part 2"}
        </button>
      </form>
    </section>
  );
}