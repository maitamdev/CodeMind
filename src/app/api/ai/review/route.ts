import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { 
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.",
          details: "Get your API key from: https://platform.openai.com/api-keys"
        },
        { status: 500 }
      )
    }

    const { code, language } = await request.json()

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const { getChatCompletion } = await import("@/lib/ollama");

    const systemPrompt = `Bạn là Senior Code Reviewer. Đánh giá code dưới đây theo tiêu chuẩn production-grade.

CODE (${language}):
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

TIÊU CHÍ ĐÁNH GIÁ (trọng số):
- Correctness (30%): Logic đúng? Xử lý edge cases? Có bug tiềm ẩn?
- Code Quality (25%): Naming conventions, DRY, single responsibility, readability.
- Performance (20%): Time/space complexity. Có bottleneck? Có cách tối ưu hơn?
- Security (15%): XSS, injection, data validation, error handling.
- Maintainability (10%): Dễ mở rộng? Có cần refactor?

TRẢ VỀ JSON CHÍNH XÁC (không markdown, không text thừa):
{
  "score": <0-10, thập phân>,
  "pros": ["<điểm mạnh cụ thể, trích dẫn dòng code nếu có>"],
  "cons": ["<điểm yếu cụ thể, chỉ ra dòng/đoạn code cần sửa>"],
  "suggestions": ["<hành động cụ thể có thể thực hiện ngay, kèm code mẫu nếu cần>"]
}

QUY TẮC:
- Trả lời bằng TIẾNG VIỆT.
- Mỗi mục pros/cons/suggestions: 2-4 items, MỖI item phải CỤ THỂ (trích dẫn tên biến, tên hàm, dòng code).
- KHÔNG dùng nhận xét chung chung như "Code tốt" hay "Cần cải thiện".
- KHÔNG thêm text ngoài JSON.`;

    const { content: text } = await getChatCompletion(
      [{ role: "system", content: systemPrompt }],
      { maxTokens: 2048, temperature: 0.3 }
    );

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI")
    }

    const reviewData = JSON.parse(jsonMatch[0])

    // Validate response structure
    if (
      typeof reviewData.score !== "number" ||
      !Array.isArray(reviewData.pros) ||
      !Array.isArray(reviewData.cons) ||
      !Array.isArray(reviewData.suggestions)
    ) {
      throw new Error("Invalid review data structure")
    }

    return NextResponse.json(reviewData)
  } catch (error) {
    console.error("AI Review Error:", error)
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("groq")) {
        return NextResponse.json(
          { 
            error: "AI API key issue",
            details: "Please check your GROQ_API_KEY in .env.local file"
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate AI review",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
