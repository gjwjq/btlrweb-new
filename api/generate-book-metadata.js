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

async function findVerifiedIsbn({ title, author, isbn }) {
  if (isbn) return isbn.replace(/[^0-9X]/gi, "");
  try {
    const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`);
    if (!response.ok) return "";
    const data = await response.json();
    const normalizedTitle = title.replace(/\s+/g, "").toLowerCase();
    const normalizedAuthor = author.replace(/\s+/g, "").toLowerCase();
    const match = (data.items || []).find((item) => {
      const info = item.volumeInfo || {};
      const candidateTitle = String(info.title || "").replace(/\s+/g, "").toLowerCase();
      const candidateAuthors = (info.authors || []).join(" ").replace(/\s+/g, "").toLowerCase();
      return candidateTitle.includes(normalizedTitle) && candidateAuthors.includes(normalizedAuthor);
    });
    const identifiers = match?.volumeInfo?.industryIdentifiers || [];
    return identifiers.find((item) => item.type === "ISBN_13")?.identifier
      || identifiers.find((item) => item.type === "ISBN_10")?.identifier
      || "";
  } catch {
    return "";
  }
}

function extractOutputText(response) {
  for (const item of response.output || []) {
    if (item.type !== "message") continue;
    for (const content of item.content || []) {
      if (content.type === "output_text") return content.text;
    }
  }
  return "";
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "POST 요청만 사용할 수 있습니다." });
  }

  const admin = await getAdminUser(request.headers.authorization);
  if (!admin) return response.status(403).json({ message: "관리자 권한이 필요합니다." });
  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ message: "Vercel에 OPENAI_API_KEY 환경변수를 먼저 등록해 주세요." });
  }

  const input = request.body || {};
  const title = String(input.title || "").trim().slice(0, 200);
  const author = String(input.author || "").trim().slice(0, 120);
  if (!title || !author) return response.status(400).json({ message: "제목과 저자가 필요합니다." });

  const verifiedIsbn = await findVerifiedIsbn({
    title,
    author,
    isbn: String(input.isbn || "").trim(),
  });

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      store: false,
      instructions: [
        "당신은 한국 공공도서관의 도서 메타데이터 작성 담당자입니다.",
        "제공된 제목과 저자를 기반으로 한국어 메타데이터를 간결하고 사실적으로 작성하세요.",
        "청구기호는 KDC 분류를 참고한 실무용 제안값으로 작성하세요.",
        "위치는 반드시 제공된 선택지 중 가장 적합한 하나를 고르세요.",
        "ISBN은 생성하거나 추측하지 마세요. 입력에 제공된 verifiedIsbn 값만 그대로 사용하세요.",
        "책의 내용을 확실히 알 수 없으면 과장하거나 구체적 사실을 지어내지 말고 일반적인 수준으로 작성하세요.",
      ].join(" "),
      input: JSON.stringify({
        title,
        author,
        publisher: String(input.publisher || "").trim().slice(0, 120),
        publishedDate: String(input.publishedDate || "").trim(),
        category: String(input.category || "").trim().slice(0, 80),
        verifiedIsbn,
      }),
      text: {
        format: {
          type: "json_schema",
          name: "library_book_metadata",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              author: { type: "string" },
              publisher: { type: "string" },
              publishedDate: { type: "string" },
              category: { type: "string" },
              isbn: { type: "string" },
              callNumber: { type: "string" },
              location: {
                type: "string",
                enum: ["문학자료실 1층", "어린이자료실 1층", "인문사회자료실 2층", "과학기술자료실 2층", "디지털자료실 3층", "종합자료실 2층"],
              },
              keywords: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
              shortDescription: { type: "string" },
              description: { type: "string" },
            },
            required: ["author", "publisher", "publishedDate", "category", "isbn", "callNumber", "location", "keywords", "shortDescription", "description"],
          },
        },
      },
      max_output_tokens: 1200,
    }),
  });

  const result = await apiResponse.json();
  if (!apiResponse.ok) {
    return response.status(502).json({ message: result.error?.message || "OpenAI API 요청에 실패했습니다." });
  }

  try {
    const metadata = JSON.parse(extractOutputText(result));
    metadata.isbn = verifiedIsbn;
    return response.status(200).json(metadata);
  } catch {
    return response.status(502).json({ message: "AI 응답을 도서 정보로 변환하지 못했습니다." });
  }
};
