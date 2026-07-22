const SUPABASE_URL = process.env.SUPABASE_URL || "https://khbnqkkxhcluqczxvdyv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_QnlhzDiZqQyV1DSf_uKUVA_0XuNS6LN";

async function getAdminUser(authorization) {
  if (!authorization?.startsWith("Bearer ")) return null;
  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: authorization },
  });
  if (!userResponse.ok) return null;
  const user = await userResponse.json();
  const profileResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
    { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: authorization } },
  );
  if (!profileResponse.ok) return null;
  const profiles = await profileResponse.json();
  return profiles[0]?.role === "admin" ? user : null;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "POST 요청만 사용할 수 있습니다." });
  }

  const admin = await getAdminUser(request.headers.authorization);
  if (!admin) return response.status(403).json({ message: "관리자 권한이 필요합니다." });
  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({ message: "Vercel에 GEMINI_API_KEY 환경변수를 먼저 등록해 주세요." });
  }

  const input = request.body || {};
  const title = String(input.title || "").trim().slice(0, 200);
  const author = String(input.author || "").trim().slice(0, 120);
  if (!title || !author) return response.status(400).json({ message: "제목과 저자가 필요합니다." });

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const apiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: [
            "당신은 한국 도서관 프로젝트의 도서 정보 작성 담당자입니다.",
            "제공된 제목과 저자를 기반으로 한국어 메타데이터를 간결하고 사실적으로 작성하세요.",
            "책의 내용을 확실히 알 수 없으면 과장하거나 구체적 사실을 지어내지 말고 일반적인 수준으로 작성하세요.",
          ].join(" "),
        }],
      },
      contents: [{
        role: "user",
        parts: [{
          text: JSON.stringify({
            title,
            author,
            publisher: String(input.publisher || "").trim().slice(0, 120),
            publishedDate: String(input.publishedDate || "").trim(),
            category: String(input.category || "").trim().slice(0, 80),
          }),
        }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "object",
            properties: {
              author: { type: "string" },
              publisher: { type: "string" },
              publishedDate: { type: "string" },
              category: { type: "string" },
              keywords: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
              shortDescription: { type: "string" },
              description: { type: "string" },
            },
            required: ["author", "publisher", "publishedDate", "category", "keywords", "shortDescription", "description"],
        },
        maxOutputTokens: 1200,
      },
    }),
  });

  const result = await apiResponse.json();
  if (!apiResponse.ok) {
    return response.status(502).json({ message: result.error?.message || "Gemini API 요청에 실패했습니다." });
  }

  try {
    const outputText = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");
    if (!outputText) throw new Error("empty response");
    const metadata = JSON.parse(outputText);
    return response.status(200).json(metadata);
  } catch {
    return response.status(502).json({ message: "AI 응답을 도서 정보로 변환하지 못했습니다." });
  }
};
