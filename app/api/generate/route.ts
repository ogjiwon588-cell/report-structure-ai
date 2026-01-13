import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const topic = (body?.topic ?? "").toString().trim();

    if (!topic) {
      return NextResponse.json(
        { error: "실험 주제를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const prompt = `
너는 고등학교 과학 수행평가를 채점하는 교사다.
아래 주제에 대해 **실험 보고서 채점 기준에 맞는 구조**를 작성하라.

주제: "${topic}"

아래 형식을 반드시 그대로 지켜라.

## 1. 가설 설정
- 독립변인:
- 종속변인:
- 통제변인:
- 가설 문장:

## 2. 실험 설계 핵심 체크
- 실험군/대조군:
- 반복 횟수:
- 측정 방법:
- 안전 유의사항:

## 3. 결과 정리 시 필수 요소
- 그래프/표:
- 단위 표기:
- 평균/오차 처리:

## 4. 오차 요인 및 한계
- 측정 오차:
- 환경 변수:
- 설계 한계:

## 5. 감점 포인트 (빠지면 감점)
- 변인 정의 불명확
- 결과-결론 불일치
- 형식 누락

## 6. 가산점 요소
- 추가 실험 제안
- 실제 사례 연결
- 한계 보완 아이디어
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message?.content ?? "";
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "서버 오류" },
      { status: 500 }
    );
  }
}