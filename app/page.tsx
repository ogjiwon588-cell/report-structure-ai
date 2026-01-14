"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("탐구 보고서");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const canGenerate = () => {
    const today = new Date().toDateString();
    return localStorage.getItem("usedDate") !== today;
  };

  const markUsed = () => {
    const today = new Date().toDateString();
    localStorage.setItem("usedDate", today);
  };

  const generate = async () => {
    if (!canGenerate()) {
      alert("무료 이용은 하루 1회입니다. 프리미엄으로 무제한 사용하세요.");
      return;
    }

    setLoading(true);
    setResult("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, type }),
    });

    if (res.status === 429) {
      alert("오늘 무료 사용을 모두 사용했습니다.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
    markUsed();
  };

  const sections = result
    ? result.split(/\n(?=I\. |II\. |III\. )/)
    : [];

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 900 }}>
      <h1>Report Structure AI</h1>
      <p>글을 쓰기 전에, 구조부터 만드세요.</p>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ padding: 10, marginBottom: 10 }}
      >
        <option>탐구 보고서</option>
        <option>실험 보고서</option>
        <option>주장형 에세이</option>
        <option>자료 조사 보고서</option>
      </select>

      <br />

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

      <p style={{ marginTop: 10, color: "#666", fontSize: 14 }}>
        무료: 하루 1회 · 프리미엄: 무제한
      </p>

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