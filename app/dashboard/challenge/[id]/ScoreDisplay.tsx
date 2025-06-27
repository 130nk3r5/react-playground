"use client";
import React, { useEffect, useState } from "react";

export default function ScoreDisplay() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading score...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
      <strong>Your Score: {score}</strong>
    </div>
  );
}
