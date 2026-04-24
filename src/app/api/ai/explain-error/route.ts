import { NextRequest, NextResponse } from "next/server"
import { getChatCompletion } from "@/lib/ollama"

export async function POST(request: NextRequest) {
  try {
    const { error: errorMessage, code, language } = await request.json()

    if (!errorMessage || !errorMessage.trim()) {
      return NextResponse.json(
        { error: "error message is required" },
        { status: 400 }
      )
    }

    const lang = language || "javascript"

    const systemPrompt = `Bạn là Debugger chuyên gia. Phân tích lỗi và đưa ra cách sửa chính xác.

QUY TRÌNH:
1. Xác định loại lỗi (syntax, runtime, logic, type error, v.v.)
2. Chỉ ra ROOT CAUSE — tại sao lỗi xảy ra, không chỉ mô tả triệu chứng.
3. Đưa ra code đã sửa hoàn chỉnh, chạy được ngay.

TRẢ VỀ JSON (không markdown, không text thừa):
{
  "explanation": "Phân tích nguyên nhân gốc rễ. Dòng nào gây lỗi, tại sao.",
  "suggestion": "Cách sửa cụ thể, từng bước nếu cần.",
  "fixedCode": "Source code đã sửa hoàn chỉnh"
}

QUY TẮC:
- Trả lời bằng TIẾNG VIỆT. Thuật ngữ kỹ thuật giữ nguyên tiếng Anh.
- KHÔNG lặp lại thông báo lỗi. KHÔNG mở đầu bằng lời chào.
- explanation phải chỉ ra CHÍNH XÁC dòng/biến/hàm gây lỗi.
- fixedCode phải là code CHẠY ĐƯỢC, không phải pseudo-code.`

    const userMessage = code
      ? `Lỗi: ${errorMessage}\n\nCode (${lang}):\n\`\`\`${lang}\n${code}\n\`\`\`\n\nHãy giải thích lỗi này và đề xuất cách sửa.`
      : `Lỗi: ${errorMessage}\n\nNgôn ngữ: ${lang}\n\nHãy giải thích lỗi này và đề xuất cách sửa.`

    const result = await getChatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      { maxTokens: 1024, temperature: 0.2 }
    )

    // Try to parse JSON response
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          explanation: parsed.explanation || result.content,
          suggestion: parsed.suggestion || "",
          fixedCode: parsed.fixedCode || undefined,
          model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
          durationMs: result.durationMs,
        })
      } catch {
        // JSON parse failed, return raw response
      }
    }

    // Fallback: return raw response as explanation
    return NextResponse.json({
      explanation: result.content,
      suggestion: "",
      fixedCode: undefined,
      model: process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
      durationMs: result.durationMs,
    })
  } catch (error) {
    console.error("AI Error Explanation Error:", error)

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
      { error: "Failed to explain error", details: message },
      { status: 500 }
    )
  }
}
