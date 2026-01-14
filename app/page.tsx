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

  const sections = result
    ? result.split(/\n(?=I\. |II\. |III\. )/)
    : [];

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 800 }}>
      <h1>Report Structure AI</h1>
      <p>글을 쓰기 전에, 구조부터 만드세요.</p>

      <input
        placeholder="과제 주제 입력"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: 10, width: "100%", maxWidth: 400 }}
      />

      <br /><br />

      <button onClick={generate} disabled={loading || !topic}>
        {loading ? "생성 중..." : "과제 구조 만들기"}
      </button>

      {/* 결과 카드 */}
      <div style={{ marginTop: 40 }}>
        {sections.map((sec, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              background: "#fafafa",
            }}
          >
            <strong>{sec.split("\n")[0]}</strong>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
              {sec.replace(sec.split("\n")[0], "").trim()}
            </pre>
          </div>
        ))}
      </div>
    </main>
  );
}