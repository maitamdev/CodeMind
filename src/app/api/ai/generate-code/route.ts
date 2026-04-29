import { NextRequest, NextResponse } from "next/server"
import { getChatCompletion } from "@/lib/ollama"

/**
 * @swagger
 * /api/ai/generate-code:
 *   post:
 *     tags:
 *       - Ai
 *     summary: API endpoint for /api/ai/generate-code
 *     description: Tự động sinh tài liệu cho POST /api/ai/generate-code. Hãy cập nhật mô tả chi tiết sau.
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, language, existingCode } = await request.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      )
    }

    const lang = language || "javascript"

    // Build system message for code generation
    const systemMessage = `Bạn là Code Generator chuyên nghiệp. Sinh code ${lang} chất lượng production-grade.

QUY TẮC SINH CODE:
- Code phải CHẠY ĐƯỢC ngay, không thiếu import, không thiếu khai báo.
- Tuân thủ naming conventions và best practices của ${lang}.
- Comment ngắn gọn bằng tiếng Việt cho logic phức tạp. KHÔNG comment cho dòng hiển nhiên.
- Nếu có code hiện tại: Giữ nguyên cấu trúc, chỉ thêm/sửa phần được yêu cầu.

ĐỊNH DẠNG TRẢ LỜI:
1. Code block duy nhất với language tag \`\`\`${lang}
2. Sau code block: Giải thích ngắn gọn (2-5 dòng) những gì code làm và tại sao chọn approach này.

TUYỆT ĐỐI KHÔNG:
- Không mở đầu bằng lời chào hay "Dưới đây là code".
- Không đưa nhiều phiên bản code. Chỉ 1 phiên bản tốt nhất.
- Không dùng placeholder như "// TODO" hay "// thêm code ở đây".`

    const userMessage = existingCode
      ? `Code hiện tại (${lang}):\n\`\`\`${lang}\n${existingCode}\n\`\`\`\n\nYêu cầu: ${prompt}`
      : `Sinh code ${lang}: ${prompt}`

    const result = await getChatCompletion(
      [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      { maxTokens: 2048, temperature: 0.3 }
    )

    // Parse code block from response
    const codeMatch = result.content.match(/```[\w]*\n([\s\S]*?)```/)
    const extractedCode = codeMatch ? codeMatch[1].trim() : ""

    // Extract explanation (text after code block, or full response if no code block)
    const explanation = codeMatch
      ? result.content.replace(/```[\w]*\n[\s\S]*?```/, "").trim()
      : result.content

    return NextResponse.json({
      code: extractedCode || result.content,
      explanation: explanation || "Code đã được sinh thành công.",
      language: lang,
      model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
      durationMs: result.durationMs,
    })
  } catch (error) {
    console.error("AI Code Generation Error:", error)

    const message = error instanceof Error ? error.message : "Unknown error"

    if (message.includes("timed out")) {
      return NextResponse.json(
        { error: "AI server timed out", details: message },
        { status: 504 }
      )
    }

    if (message.includes("fetch") || message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "AI server is not reachable", details: message },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate code", details: message },
      { status: 500 }
    )
  }
}
