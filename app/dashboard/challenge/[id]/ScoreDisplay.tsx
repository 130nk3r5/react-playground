"use client";
import React, { useEffect, useState } from "react";

export default function ScoreDisplay() {
  const [score, setScore] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch("/api/get-score", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch score");
        const data = await res.json();
        setScore(data.score);
      } catch (err) {
        console.log(err);
        setError("Could not load score");
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, []);

  // Animate the score counting up
  useEffect(() => {
    if (typeof score === 'number' && !loading && !error) {
      setVisible(true);
      const duration = 1200; // ms
      const startTime = performance.now();
      function animate(now: number) {
        if (typeof score !== 'number') return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * score);
        setDisplayScore(current);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayScore(score as number);
        }
      }
      requestAnimationFrame(animate);
    }
  }, [score, loading, error]);

  if (loading) return <div>Loading score...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div
      style={{
        marginTop: "1rem",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#fff",
        background: "linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)",
        borderRadius: "1rem",
        boxShadow: "0 4px 24px rgba(79,70,229,0.15)",
        padding: "2rem 2.5rem",
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.9)",
        transition: "opacity 0.7s cubic-bezier(.4,2,.6,1), transform 0.7s cubic-bezier(.4,2,.6,1)",
      }}
    >
      <span style={{
        fontSize: "2.5rem",
        letterSpacing: "2px",
        textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "inline-block",
        transition: "color 0.5s"
      }}>
        🎉 Your Score: {displayScore}
      </span>
    </div>
  );
}
