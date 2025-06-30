'use client';

import React, { useState, useEffect, useRef } from "react";

function ConfettiBurst() {
  // More obvious, slower confetti burst using emoji
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -40,
        textAlign: "center",
        fontSize: "3.5rem",
        pointerEvents: "none",
        animation: "confetti-burst 2.5s cubic-bezier(.4,2,.6,1)"
      }}
    >
      🎉🎊✨
      <style>{`
        @keyframes confetti-burst {
          0% { opacity: 0; transform: translateY(0) scale(0.7); }
          20% { opacity: 1; transform: translateY(-30px) scale(1.2); }
          50% { opacity: 1; transform: translateY(-80px) scale(1.3) rotate(-8deg); }
          70% { opacity: 0.9; transform: translateY(-120px) scale(1.1) rotate(8deg); }
          100% { opacity: 0; transform: translateY(-180px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}

export default function AnswerForm({ challengeId }: { challengeId: string }) {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [answer1Correct, setAnswer1Correct] = useState(false);
  const [answer2Correct, setAnswer2Correct] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake1, setShake1] = useState(false);
  const [shake2, setShake2] = useState(false);
  const [submitting1, setSubmitting1] = useState(false);
  const [submitting2, setSubmitting2] = useState(false);
  const [lastSubmit1, setLastSubmit1] = useState(0);
  const [lastSubmit2, setLastSubmit2] = useState(0);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  async function handleSubmit1(e: React.FormEvent) {
    e.preventDefault();
    if (submitting1 || Date.now() - lastSubmit1 < 1000) return;
    setSubmitting1(true);
    setLastSubmit1(Date.now());
    setMessage(null);
    setMessageType(null);
    setShowConfetti(false);
    setShake1(false);
    const res = await fetch('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify({ challengeId, part: 1, answer: answer1 }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(data.answer1Correct ? "Part 1 correct!" : "Part 1 submitted, but not correct.");
      setMessageType(data.answer1Correct ? 'success' : 'error');
      setAnswer1Correct(data.answer1Correct);
      if (data.answer1Correct) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      } else {
        setShake1(true);
        setTimeout(() => setShake1(false), 600);
      }
      fetchAnswers();
      fetchScore();
    } else {
      setMessage("Failed to submit Part 1.");
      setMessageType('error');
      setShake1(true);
      setTimeout(() => setShake1(false), 600);
    }
    setTimeout(() => setSubmitting1(false), 500); // debounce
  }

  async function handleSubmit2(e: React.FormEvent) {
    e.preventDefault();
    if (submitting2 || Date.now() - lastSubmit2 < 1000) return;
    setSubmitting2(true);
    setLastSubmit2(Date.now());
    setMessage(null);
    setMessageType(null);
    setShowConfetti(false);
    setShake2(false);
    const res = await fetch('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify({ challengeId, part: 2, answer: answer2 }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(data.answer2Correct ? "Part 2 correct! 🎉" : "Part 2 submitted, but not correct.");
      setMessageType(data.answer2Correct ? 'success' : 'error');
      setAnswer2Correct(data.answer2Correct);
      if (data.answer2Correct) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      } else {
        setShake2(true);
        setTimeout(() => setShake2(false), 600);
      }
      fetchAnswers();
      fetchScore();
    } else {
      setMessage("Failed to submit Part 2.");
      setMessageType('error');
      setShake2(true);
      setTimeout(() => setShake2(false), 600);
    }
    setTimeout(() => setSubmitting2(false), 500); // debounce
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
    <section className="mb-8" style={{ position: "relative" }}>
      <h3>Current Score: {score}</h3>
      <h3 className="font-bold mb-2">Submit or update your answers</h3>
      {message && (
        <div
          ref={messageRef}
          className={`mb-2 ${messageType === 'success' ? 'text-green-600' : messageType === 'error' ? 'text-red-600' : ''}`}
          style={{
            opacity: 1,
            animation: "fadeIn 0.7s cubic-bezier(.4,2,.6,1)",
          }}
        >
          {message}
        </div>
      )}
      {showConfetti && <ConfettiBurst />}
      <form onSubmit={handleSubmit1} className={`flex flex-col gap-2 mb-4 ${shake1 ? 'shake' : ''}`}>
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
          className={`bg-blue-600 text-white px-4 py-1 rounded mt-2 transition-transform duration-100 active:scale-95 ${submitting1 ? 'pressed' : ''}`}
          disabled={answer1Correct || submitting1}
          style={{
            opacity: submitting1 ? 0.7 : 1,
            boxShadow: submitting1 ? '0 2px 8px #60a5fa' : undefined,
            transform: submitting1 ? 'scale(0.96)' : undefined,
            pointerEvents: submitting1 ? 'none' : undefined,
          }}
        >
          {submitting1 ? <span className="loader mr-2"></span> : null}
          {answer1Correct ? "Locked (Correct)" : "Submit/Update Part 1"}
        </button>
      </form>
      <form onSubmit={handleSubmit2} className={`flex flex-col gap-2 ${shake2 ? 'shake' : ''}`}>
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
          className={`bg-blue-600 text-white px-4 py-1 rounded mt-2 transition-transform duration-100 active:scale-95 ${submitting2 ? 'pressed' : ''}`}
          disabled={answer2Correct || submitting2}
          style={{
            opacity: submitting2 ? 0.7 : 1,
            boxShadow: submitting2 ? '0 2px 8px #60a5fa' : undefined,
            transform: submitting2 ? 'scale(0.96)' : undefined,
            pointerEvents: submitting2 ? 'none' : undefined,
          }}
        >
          {submitting2 ? <span className="loader mr-2"></span> : null}
          {answer2Correct ? "Locked (Correct)" : "Submit/Update Part 2"}
        </button>
      </form>
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .text-red-600 { color: #dc2626; }
        .text-green-600 { color: #16a34a; }
        .loader {
          display: inline-block;
          width: 1em;
          height: 1em;
          border: 2px solid #fff;
          border-top: 2px solid #60a5fa;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}