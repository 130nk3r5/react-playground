'use client';

import React, { useEffect, useState } from "react";

const TROPHIES = [
  { emoji: '🥇', color: '#FFD700' }, // Gold
  { emoji: '🥈', color: '#C0C0C0' }, // Silver
  { emoji: '🥉', color: '#CD7F32' }, // Bronze
];

interface UserScore {
  id: string;
  name: string;
  email: string;
  score: number;
}

export default function AllScoresPage() {
  const [users, setUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllScores() {
      try {
        const res = await fetch("/api/all-scores", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch scores");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("Could not load scores");
      } finally {
        setLoading(false);
      }
    }
    fetchAllScores();
  }, []);

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 32, textAlign: 'center', letterSpacing: 1 }}>🏆 All User Scores</h1>
      {loading ? (
        <div className="fade-in" style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(79,70,229,0.10)" }}>
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 16, textAlign: "left", fontSize: 18 }}>#</th>
                <th style={{ padding: 16, textAlign: "left", fontSize: 18 }}>Name</th>
                <th style={{ padding: 16, textAlign: "left", fontSize: 18 }}>Email</th>
                <th style={{ padding: 16, textAlign: "right", fontSize: 18 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: UserScore, i: number) => {
                const trophy = TROPHIES[i];
                return (
                  <tr
                    key={u.id}
                    className={`fade-in-row`}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      background: i === 0 ? "#fffbe6" : i === 1 ? "#f8fafc" : i === 2 ? "#fdf6f0" : undefined,
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    <td style={{ padding: 16, fontWeight: 700, fontSize: 18 }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {trophy && (
                        <span style={{ fontSize: '2rem', marginRight: 6, filter: `drop-shadow(0 2px 6px ${trophy.color}88)` }}>
                          {trophy.emoji}
                        </span>
                      )}
                      <span>{u.name || <span style={{ color: '#888' }}>Anonymous</span>}</span>
                    </td>
                    <td style={{ padding: 16 }}>{u.email}</td>
                    <td style={{ padding: 16, textAlign: "right", fontWeight: 700, fontSize: 18 }}>{u.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <style>{`
        .fade-in-row {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeInUp 0.7s cubic-bezier(.4,2,.6,1) forwards;
        }
        .fade-in-row:nth-child(1) { animation-delay: 0ms; }
        .fade-in-row:nth-child(2) { animation-delay: 80ms; }
        .fade-in-row:nth-child(3) { animation-delay: 160ms; }
        .fade-in-row:nth-child(4) { animation-delay: 240ms; }
        .fade-in-row:nth-child(5) { animation-delay: 320ms; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.7s forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
