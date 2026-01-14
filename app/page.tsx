"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        type: "탐구 보고서",
      }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Report Structure AI</h1>
      <p>글을 쓰기 전에, 구조부터 만드세요.</p>

      <input
        placeholder="과제 주제 입력"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "생성 중..." : "과제 구조 만들기"}
      </button>

      {result && (
        <pre style={{ marginTop: 30, whiteSpace: "pre-wrap" }}>
          {result}
        </pre>
      )}
    </main>
  );
}