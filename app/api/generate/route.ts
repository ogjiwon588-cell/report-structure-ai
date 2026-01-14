import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 아주 간단한 하루 1회 IP 제한 (MVP용)
const ipUsage = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const today = new Date().toDateString();

    if (ipUsage.get(ip) === today) {
      return NextResponse.json(
        { error: "Daily limit reached" },
        { status: 429 }
      );
    }

    const { topic, type } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "topic is required" },
        { status: 400 }
      );
    }

    const prompt = `
너는 학생 과제 평가 기준에 맞춰 "글 구조만" 설계하는 도우미다.

과제 유형: ${type}
주제: ${topic}

출력 규칙:
- 글을 대신 써주지 마라
- 구조와 논리 역할만 제시하라
- 평가받기 좋은 흐름을 명확히 하라

출력 형식:
제목
I. 서론
- 목적
- 문제 제기

II. 본론
- 단락 1 역할
- 단락 2 역할
- 사용 개념 키워드

III. 결론
- 요약
- 평가 포인트 연결
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    ipUsage.set(ip, today);

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "internal error" },
      { status: 500 }
    );
  }
}