"use client";

import { useEffect, useState } from "react";

const MAX_FREE = 3;

export default function Page() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [remain, setRemain] = useState(MAX_FREE);

  useEffect(() => {
    const used = Number(localStorage.getItem("usedCount") || "0");
    setRemain(Math.max(0, MAX_FREE - used));
  }, []);

  async function generate() {
    if (!topic) return;

    const used = Number(localStorage.getItem("usedCount") || "0");
    if (used >= MAX_FREE) {
      setResult(
        "🚫 무료 사용 횟수를 모두 사용했습니다.\n\n유료로 잠금 해제하세요."
      );
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청 실패");

      const nextUsed = used + 1;
      localStorage.setItem("usedCount", String(nextUsed));
      setRemain(Math.max(0, MAX_FREE - nextUsed));

      setResult(data.result);
    } catch (e: any) {
      setResult("❌ 오류 발생");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>보고서 구조 생성기</h1>

      <p>무료 사용 남은 횟수: {remain} / {MAX_FREE}</p>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="주제 입력"
        style={{ padding: 8, width: "100%", maxWidth: 400 }}
      />

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "생성 중..." : "구조 생성"}
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {result}
      </pre>
    </main>
  );
}