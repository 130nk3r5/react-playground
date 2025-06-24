'use client';

import React from "react";

export default function InputSection({ input }: { input: string }) {
  function handleCopyInput() {
    navigator.clipboard.writeText(input);
  }

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        YOUR INPUT!
        <button
          type="button"
          onClick={handleCopyInput}
          style={{
            fontSize: "1rem",
            padding: "0.25rem 0.75rem",
            marginLeft: "0.5rem",
            background: "#e0e7ef",
            border: "1px solid #b0b8c1",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Copy
        </button>
      </h3>
      <pre style={{ background: "#f6f8fa", padding: "1rem", borderRadius: "6px", overflowX: "auto" }}>
        {input}
      </pre>
    </section>
  );
}