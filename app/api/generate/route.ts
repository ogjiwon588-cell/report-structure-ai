import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, type } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "topic is required" },
        { status: 400 }
      );
    }

    const prompt = `
너는 학생 과제 평가 기준에 맞춰 "글 구조만" 설계하는 도우미다.

과제 유형: ${type ?? "탐구 보고서"}
주제: ${topic}

출력 형식:
- 제목
- I. 서론: 목적
- II. 본론: 단락별 역할
- III. 결론: 평가 포인트 연결

문장은 최소화하고, 구조 중심으로 작성해라.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

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