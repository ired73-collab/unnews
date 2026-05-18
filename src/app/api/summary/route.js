export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 20) {
      return Response.json({ summary: "" });
    }

    const prompt = `
다음 본문을 정확히 3문장으로 요약해줘.
조건:
- 반드시 3문장
- 각 문장은 짧고 명확하게
- 불필요한 설명 금지

본문:
${text}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    const summary =
      data?.choices?.[0]?.message?.content?.trim() || "";

    return Response.json({ summary });
  } catch (error) {
    console.error(error);
    return Response.json({ summary: "" });
  }
}
